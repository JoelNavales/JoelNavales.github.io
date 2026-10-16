import type { Project } from '../../data';

// Matches the screen plane on the 3D phone (0.8 × 1.72).
export const SCREEN_WIDTH = 512;
export const SCREEN_HEIGHT = 1100;

const INK = '#262723';
const PAPER = '#f6f4ed';
const MUTED = '#686961';

const covers = new Map<string, Promise<HTMLImageElement>>();

function loadCover(src: string) {
  let pending = covers.get(src);
  if (!pending) {
    pending = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
    covers.set(src, pending);
  }
  return pending;
}

export function blankScreen(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  if (!context) return;
  context.fillStyle = PAPER;
  context.beginPath();
  context.roundRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 56);
  context.fill();
}

// A small app-style card for the project, painted once and reused as a texture.
export async function drawScreen(canvas: HTMLCanvasElement, project: Project) {
  const [cover] = await Promise.all([
    loadCover(project.image),
    document.fonts.load('800 46px Manrope'),
    document.fonts.load('400 26px "DM Sans"'),
    document.fonts.load('400 20px "IBM Plex Mono"'),
  ]);
  const context = canvas.getContext('2d');
  if (!context) return;
  const width = SCREEN_WIDTH;
  const height = SCREEN_HEIGHT;

  context.clearRect(0, 0, width, height);
  context.save();
  context.beginPath();
  context.roundRect(0, 0, width, height, 56);
  context.clip();
  context.fillStyle = PAPER;
  context.fillRect(0, 0, width, height);

  context.fillStyle = INK;
  context.font = '400 22px "IBM Plex Mono"';
  context.fillText('9:41', 46, 64);
  context.beginPath();
  context.roundRect(width / 2 - 62, 36, 124, 38, 19);
  context.fill();
  context.beginPath();
  context.roundRect(width - 94, 48, 46, 20, 6);
  context.fill();

  const coverX = 28;
  const coverY = 116;
  const coverWidth = width - 56;
  const coverHeight = (coverWidth * 650) / 900;
  context.save();
  context.beginPath();
  context.roundRect(coverX, coverY, coverWidth, coverHeight, 28);
  context.clip();
  context.drawImage(cover, coverX, coverY, coverWidth, coverHeight);
  context.restore();

  const textY = coverY + coverHeight;
  context.fillStyle = MUTED;
  context.font = '400 20px "IBM Plex Mono"';
  context.fillText(project.category.toUpperCase(), 36, textY + 64);
  context.fillStyle = INK;
  context.font = '800 46px Manrope';
  context.fillText(project.title, 34, textY + 126);
  context.fillStyle = MUTED;
  context.font = '400 26px "DM Sans"';
  context.fillText(project.status, 36, textY + 176);

  let tagX = 36;
  context.font = '400 20px "IBM Plex Mono"';
  for (const tech of project.stack) {
    const tagWidth = context.measureText(tech).width + 32;
    context.strokeStyle = '#c9c8bd';
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(tagX, textY + 210, tagWidth, 44, 8);
    context.stroke();
    context.fillStyle = INK;
    context.fillText(tech, tagX + 16, textY + 239);
    tagX += tagWidth + 12;
  }

  context.fillStyle = INK;
  context.beginPath();
  context.roundRect(36, height - 156, width - 72, 92, 24);
  context.fill();
  context.fillStyle = PAPER;
  context.font = '400 28px "DM Sans"';
  context.fillText('Tap for the next one', 72, height - 100);
  context.restore();
}
