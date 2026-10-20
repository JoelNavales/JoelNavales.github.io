import { execFile } from 'node:child_process';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

// Turns each master in media/videos/ into what the site serves: an AV1 WebM for browsers
// that can decode it, an H.264 MP4 for everything else, and a JPEG poster that doubles as
// the project's cover. Writes src/videos.json so the site knows the files, size and length.
//
//   pnpm videos            encode masters that changed since their last encode
//   pnpm videos --force    re-encode everything
//   pnpm videos locker     encode just one
//
// Per-video settings live in media/videos/videos.json, e.g. { "locker": { "poster": 5.5 } }:
//   poster   seconds into the video for the poster frame (default: a fifth of the way in)
//   width    largest output width in pixels, never upscaled (default 1920)

const run = promisify(execFile);
const root = new URL('../', import.meta.url);
const sources = new URL('media/videos/', root);
const output = new URL('public/assets/videos/', root);
const manifestFile = new URL('src/videos.json', root);
const extensions = /\.(mp4|mov|m4v|webm|mkv)$/i;

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((arg) => !arg.startsWith('--'));

async function ffmpeg(...options) {
  await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...options], {
    maxBuffer: 1 << 26,
  });
}

async function probe(path) {
  const { stdout } = await run('ffprobe', [
    '-v', 'error', '-print_format', 'json', '-show_streams', '-show_format', path,
  ]);
  const info = JSON.parse(stdout);
  const video = info.streams.find((stream) => stream.codec_type === 'video');
  if (!video) throw new Error(`${path} has no video stream`);
  // Phone recordings store portrait video as landscape plus a rotation flag.
  const rotation = Math.abs(
    Number(video.side_data_list?.find((data) => 'rotation' in data)?.rotation ?? 0),
  );
  const sideways = rotation === 90 || rotation === 270;
  return {
    width: sideways ? video.height : video.width,
    height: sideways ? video.width : video.height,
    duration: Number(info.format.duration),
    audio: info.streams.some((stream) => stream.codec_type === 'audio'),
  };
}

async function modified(url) {
  try {
    return (await stat(url)).mtimeMs;
  } catch {
    return 0;
  }
}

async function readJson(url, fallback) {
  try {
    return JSON.parse(await readFile(url, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

// The AV1 level browsers check against their decoder: 3.1 covers 720p, 4.0 covers 1080p30.
function av1Level(width, height) {
  return width * height <= 1280 * 720 ? '05' : '08';
}

try {
  await run('ffmpeg', ['-version']);
} catch {
  console.error('ffmpeg is not installed. On macOS: brew install ffmpeg');
  process.exit(1);
}

await mkdir(sources, { recursive: true });
await mkdir(output, { recursive: true });

const settings = await readJson(new URL('videos.json', sources), {});
const manifest = await readJson(manifestFile, {});
const masters = (await readdir(sources)).filter((name) => extensions.test(name));
const seen = new Set();

for (const name of masters) {
  const id = name.replace(extensions, '').toLowerCase();
  if (seen.has(id)) throw new Error(`Two masters are named "${id}"; keep one.`);
  seen.add(id);
  if (only.length && !only.includes(id)) continue;

  const master = new URL(name, sources);
  const options = { width: 1920, ...settings[id] };
  const files = {
    webm: new URL(`${id}.webm`, output),
    mp4: new URL(`${id}.mp4`, output),
    poster: new URL(`${id}-poster.jpg`, output),
  };
  const outputs = await Promise.all(Object.values(files).map(modified));
  const settingsChanged = JSON.stringify(manifest[id]?.settings) !== JSON.stringify(options);
  const fresh = Math.min(...outputs) > Math.max(await modified(master), 0);
  if (!force && fresh && !settingsChanged && manifest[id]) {
    console.log(`${id}: up to date`);
    continue;
  }

  const source = await probe(fileURLToPath(master));
  // Fit within the target width, keeping both sides even as the codecs require.
  const width = Math.min(options.width, source.width) & ~1;
  const height = Math.round((source.height * width) / source.width / 2) * 2;
  const scale = `scale=${width}:${height}:flags=lanczos`;
  const posterAt = options.poster ?? source.duration / 5;
  console.log(`${id}: ${source.width}×${source.height}, ${source.duration.toFixed(1)}s → ${width}×${height}`);

  // Flat motion graphics compress well, so these favour sharp text over small files.
  const audio = (codec, bitrate) => (source.audio ? ['-c:a', codec, '-b:a', bitrate] : ['-an']);
  await ffmpeg(
    '-i', fileURLToPath(master), '-vf', scale, '-map_metadata', '-1',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-profile:v', 'high',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', ...audio('aac', '128k'),
    fileURLToPath(files.mp4),
  );
  console.log(`  ${id}.mp4`);
  await ffmpeg(
    '-i', fileURLToPath(master), '-vf', scale, '-map_metadata', '-1',
    '-c:v', 'libsvtav1', '-preset', '5', '-crf', '34', '-g', '240',
    '-pix_fmt', 'yuv420p', ...audio('libopus', '96k'),
    fileURLToPath(files.webm),
  );
  console.log(`  ${id}.webm`);
  await ffmpeg(
    '-ss', String(posterAt), '-i', fileURLToPath(master), '-frames:v', '1',
    '-vf', scale, '-q:v', '3', fileURLToPath(files.poster),
  );
  console.log(`  ${id}-poster.jpg (${posterAt.toFixed(1)}s)`);

  const audioCodec = source.audio ? ', opus' : '';
  manifest[id] = {
    width,
    height,
    duration: Math.round(source.duration * 10) / 10,
    audio: source.audio,
    poster: `assets/videos/${id}-poster.jpg`,
    sources: [
      {
        src: `assets/videos/${id}.webm`,
        type: `video/webm; codecs="av01.0.${av1Level(width, height)}M.08${audioCodec}"`,
      },
      {
        src: `assets/videos/${id}.mp4`,
        type: `video/mp4; codecs="avc1.640028${source.audio ? ', mp4a.40.2' : ''}"`,
      },
    ],
    settings: options,
  };
}

// Drop entries whose master was removed, so the site can't point at a missing video.
for (const id of Object.keys(manifest)) {
  if (!seen.has(id)) {
    delete manifest[id];
    console.log(`${id}: master removed, dropped from src/videos.json`);
  }
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(manifestFile, `${JSON.stringify(sorted, null, 2)}\n`);
