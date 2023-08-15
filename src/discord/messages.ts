import { createLeaderboardCanvas } from '../canvas';
import axios from 'axios';
import { User } from '../duolingo/types';

export function createPayloadJSON() {
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

export const postLeaderboardToChannel = async (
  leaderboard: User[],
  channelId: string,
) => {
  const formData = new FormData();
  const canvas = createLeaderboardCanvas(leaderboard);
  const blob = await fetch(canvas.toDataURL('image/png')).then((res) =>
    res.blob(),
  );
  formData.append('files[0]', blob, 'image.png');
  formData.append('payload_json', JSON.stringify(createPayloadJSON()));
  return postMessageToChannel(formData, channelId);
};

export async function postMessageToChannel(
  formData: FormData,
  channelId: string,
) {
  const url = `https://discord.com/api/v10/channels/${channelId}/messages`;

  await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  });
}
