import { createCanvas, registerFont, Image } from 'canvas';
import { prettierLeaderboard } from '../duolingo';
import { User } from '../types';
import { readFile } from 'fs';

export function createEmbed(title: string, description: string) {
  return {
    // embeds: [
    //   {
    //     // title,
    //     // description: '',
    //     image: {
    //       url: 'attachment://image.png',
    //     },
    //   },
    // ],
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
  ctx.fillStyle = '#00003a';
  ctx.roundRect(0, 0, 960, 1280, 64);
  ctx.fill();
  ctx.fillStyle = '#7AC70C';
  ctx.fillText('Duolingo Domination Leaderboard', 64, 256, 860);
  ctx.font = '32px Feather';
  ctx.fillStyle = '#FFFFFF';
  // ctx.fillText(prettierLeaderboard(sortedLeaderboard), 64, 360, 860);
  sortedLeaderboard.forEach((user, index) => {
    if (user.streak > 0) {
      const image = new Image();
      image.onload = () => ctx.drawImage(image, 144, 288 + 64 * index, 32, 32);
      image.onerror = (err: Error) => {
        throw err;
      };
      image.src = './src/fire.png';
    }
    ctx.fillText(`${index + 1}.️`, 64, 320 + 64 * index, 860);
    ctx.fillText(`${user.streak} days`, 196, 320 + 64 * index, 860);
    ctx.fillText(`${user.name}`, 380, 320 + 64 * index, 860);
    ctx.fillText(`${user.totalXp} XP`, 720, 320 + 64 * index, 860);
  });

  const image = new Image();
  image.onload = () => ctx.drawImage(image, 450, 64, 128, 128);
  image.onerror = (err: Error) => {
    throw err;
  };
  image.src = './src/logo.png';
  return canvas;
}
