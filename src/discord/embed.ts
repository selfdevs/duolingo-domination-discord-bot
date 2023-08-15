import { createCanvas, registerFont, Image } from 'canvas';
import { User } from '../types';

export function createEmbed() {
  return {
    attachments: [
      {
        id: 0,
        description: 'The leaderboard',
        name: 'image.png',
      },
    ],
  };
}

export function createLeaderboardCanvas(sortedLeaderboard: User[]) {
  registerFont('./src/feather.ttf', { family: 'Feather' });
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
  sortedLeaderboard.forEach((user, index) => {
    ctx.fillText(`${index + 1}.️`, 44, 320 + 64 * index, 860);
    if (user.streak > 0) {
      const image = new Image();
      image.onload = () => ctx.drawImage(image, 104, 288 + 64 * index, 32, 32);
      image.onerror = (err: Error) => {
        throw err;
      };
      image.src = './src/fire.png';
    }
    ctx.fillText(`${user.streak} days`, 156, 320 + 64 * index, 860);
    ctx.fillText(`${user.name}`, 320, 320 + 64 * index, 860);
    ctx.fillText(`${user.totalXp} XP`, 640, 320 + 64 * index, 860);
    ctx.fillText(` + ${user.lastWeekXP}`, 800, 320 + 64 * index, 860);
  });

  const image = new Image();
  image.onload = () => ctx.drawImage(image, 450, 64, 128, 128);
  image.onerror = (err: Error) => {
    throw err;
  };
  image.src = './src/logo.png';
  const targetImage = new Image();
  targetImage.onload = () => ctx.drawImage(targetImage, 800, 68, 84, 76);
  targetImage.onerror = (err: Error) => {
    throw err;
  };
  targetImage.src = './src/target.png';
  const gemImage = new Image();
  gemImage.onload = () => {
    ctx.drawImage(gemImage, 100, 88, 48, 60);
    ctx.drawImage(gemImage, 120, 108, 48, 60);
  };
  gemImage.onerror = (err: Error) => {
    throw err;
  };
  gemImage.src = './src/gem.png';
  return canvas;
}
