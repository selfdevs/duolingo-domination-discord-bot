import axios from 'axios';

import { BASE_URL, FAKE_USER_AGENT, USER_ENDPOINT, users } from './constants';
import { User } from './types';
import { handleAxiosError } from './axios';
import { createEmbed, createLeaderboardCanvas } from './discord/embed';

export async function getUser(id: string): Promise<User> {
  const url = BASE_URL + USER_ENDPOINT + id;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.DUOLINGO_JWT_API_TOKEN}`,
      'User-Agent': FAKE_USER_AGENT,
    },
  });
  const lastWeekXPUrl = `https://www.duolingo.com/2017-06-30/users/${id}/xp_summaries`;
  const lastWeekXPResponse = await axios.get(lastWeekXPUrl, {
    headers: {
      Authorization: `Bearer ${process.env.DUOLINGO_JWT_API_TOKEN}`,
      'User-Agent': FAKE_USER_AGENT,
    },
  });
  console.log('got user', id);
  lastWeekXPResponse.data.summaries.pop();
  return {
    ...response.data,
    lastWeekXP: lastWeekXPResponse.data.summaries.reduce(
      (acc: number, { gainedXp }: { gainedXp: number }) => acc + gainedXp,
      0,
    ),
  };
}

export const getLeaderboard = async (channelId: string): Promise<void> => {
  console.log('getting leaderboard');
  const leaderboard = await Promise.all(users.map(async (id) => getUser(id)));
  console.log('sorting leaderboard');
  const sortedLeaderboard = leaderboard
    .sort((a, b) => b.lastWeekXP - a.lastWeekXP)
    .sort((a, b) => {
      if (a.lastWeekXP === b.lastWeekXP) {
        return b.streak - a.streak;
      }
      return 0;
    });
  try {
    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
    const formData = new FormData();
    const canvas = createLeaderboardCanvas(sortedLeaderboard);
    const blob = await fetch(canvas.toDataURL('image/png')).then((res) =>
      res.blob(),
    );
    formData.append('files[0]', blob, 'image.png');
    formData.append('payload_json', JSON.stringify(createEmbed()));

    await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });
  } catch (error) {
    handleAxiosError(error);
  }
};

export function prettierLeaderboard(leaderboard: User[]): string {
  return leaderboard.reduce((acc, { name, totalXp, streak }, index) => {
    const firstPart = `${index + 1}.️ ${streak > 0 ? '🔥' : ''} ${
      index < 6 ? '__' : ''
    }${streak} days${index < 6 ? '__' : ''}   **${name}**   ${totalXp} XP\n`;
    return acc + firstPart;
  }, '');
}
