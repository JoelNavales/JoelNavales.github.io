import manifest from '../videos.json';
import { assetUrl } from './assets';

export type ProjectVideo = {
  poster: string;
  sources: { src: string; type: string }[];
  width: number;
  height: number;
  audio: boolean;
};

// Encoded videos come from `pnpm videos`, which writes src/videos.json. Look one up by the
// name of its master in media/videos/.
export function projectVideo(id: string): ProjectVideo {
  const video = (manifest as Record<string, (typeof manifest)[keyof typeof manifest]>)[id];
  if (!video)
    throw new Error(`No encoded video "${id}". Add media/videos/${id}.mp4 and run pnpm videos.`);
  return {
    poster: assetUrl(video.poster),
    sources: video.sources.map(({ src, type }) => ({ src: assetUrl(src), type })),
    width: video.width,
    height: video.height,
    audio: video.audio,
  };
}
