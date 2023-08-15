import {
  CanvasRenderingContext2D,
  createCanvas,
  Image,
  registerFont,
} from 'canvas';
import { User } from './duolingo/types';

export function createLeaderboardCanvas(sortedLeaderboard: User[]) {
  registerFont('./src/assets/feather.ttf', { family: 'Feather' });
  const canvas = createBaseCanvas();
  const ctx = canvas.getContext('2d');
  sortedLeaderboard.forEach((user, index) => {
    ctx.fillText(`${index + 1}.️`, 44, getYPosition(index), 860);
    if (user.streak > 0) {
      drawImageFromFile(
        ctx,
        './src/assets/fire.png',
        104,
        getYPosition(index) - 32,
        32,
        32,
      );
    }
    ctx.fillText(`${user.streak} days`, 156, getYPosition(index), 860);
    ctx.fillText(`${user.name}`, 320, getYPosition(index), 860);
    ctx.fillText(`${user.totalXp} XP`, 640, getYPosition(index), 860);
    ctx.fillText(` + ${user.lastWeekXP}`, 800, getYPosition(index), 860);
  });

  return canvas;
}

export function createBaseCanvas() {
  const canvas = createCanvas(960, 1280);
  const ctx = canvas.getContext('2d');
  ctx.font = '64px Feather';
  ctx.fillStyle = '#100f3ed9';
  ctx.roundRect(0, 0, 960, 1280, 64);
  ctx.fill();
  ctx.fillStyle = '#7AC70C';
  ctx.fillText('Duolingo Domination Leaderboard', 64, 256, 860);
  ctx.font = '32px Feather';
  ctx.fillStyle = '#FFFFFF';

  drawImageFromFile(ctx, './src/assets/logo.png', 450, 64, 128, 128);
  drawImageFromFile(ctx, './src/assets/target.png', 800, 68, 84, 76);
  drawImageFromFile(ctx, './src/assets/gem.png', 100, 88, 48, 60);
  drawImageFromFile(ctx, './src/assets/gem.png', 120, 108, 48, 60);

  return canvas;
}

export function drawImageFromFile(
  ctx: CanvasRenderingContext2D,
  filename: string,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const image = new Image();
  image.onload = () => {
    ctx.drawImage(image, x, y, width, height);
  };
  image.onerror = (err: Error) => {
    throw err;
  };
  image.src = filename;
}

function getYPosition(index: number) {
  return 320 + 56 * index;
}
