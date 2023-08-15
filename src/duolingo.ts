import axios from 'axios';

import { BASE_URL, FAKE_USER_AGENT, USER_ENDPOINT, users } from './constants';
import { User } from './types';
import { handleAxiosError } from './axios';
import { createEmbed } from './discord/embed';

export async function getUser(id: string): Promise<User> {
  const url = BASE_URL + USER_ENDPOINT + id;
  const response = await axios.get<User>(url, {
    headers: {
      Authorization: `Bearer ${process.env.DUOLINGO_JWT_API_TOKEN}`,
      'User-Agent': FAKE_USER_AGENT,
    },
  });
  console.log('got user', id);
  return response.data;
}

export const getLeaderboard = async (channelId: string): Promise<void> => {
  console.log('getting leaderboard');
  const leaderboard = await Promise.all(users.map(async (id) => getUser(id)));
  console.log('sorting leaderboard');
  const sortedLeaderboard = leaderboard
    .sort((a, b) => b.streak - a.streak)
    .sort((a, b) => {
      if (a.streak === b.streak) {
        return b.totalXp - a.totalXp;
      }
      return 0;
    });
  try {
    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
    await axios.post(
      url,
      {
        ...createEmbed(
          '🦜 Duolingo Domination Leaderboard 🦜',
          prettierLeaderboard(sortedLeaderboard),
        ),
      },
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      },
    );
  } catch (error) {
    console.log('error posting leaderboard', error);
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
