import { BASE_URL, USER_ENDPOINT, users } from './constants';
import axios from 'axios';
import { User } from './types';
import { handleAxiosError } from './axios';

export async function getUser(id: string): Promise<User> {
  const url = BASE_URL + USER_ENDPOINT + id;
  try {
    const response = await axios.get<User>(url, {
      headers: {
        Authorization: `Bearer ${process.env.DUOLINGO_JWT_API_TOKEN}`,
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/85.0.4183.83 Chrome/85.0.4183.83 Safari/537.36',
      },
    });
    console.log('got user', id);
    return response.data;
  } catch (error) {
    console.log('error getting user', id);
    handleAxiosError(error);
    return {
      name: 'unknown',
      streak: 0,
      totalXp: 0,
    };
  }
}

export const getLeaderboard = async (channelId: string): Promise<void> => {
  console.log('getting leaderboard');
  const leaderboard = await Promise.all(
    users.map(async (id) => {
      const user = await getUser(id);
      return {
        username: user.name,
        points: user.totalXp,
        streak: user.streak,
      };
    }),
  );
  console.log('sorting leaderboard');
  const sortedLeaderboard = leaderboard
    .sort((a, b) => b.streak - a.streak)
    .sort((a, b) => {
      if (a.streak === b.streak) {
        return b.points - a.points;
      }
      return 0;
    });
  try {
    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
    await axios.post(
      url,
      {
        embeds: [
          {
            title: '🦜 Duolingo Domination Leaderboard 🦜',
            description: prettierLeaderboard(sortedLeaderboard),
          },
        ],
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

type LeaderboardEntry = {
  username: string;
  points: number;
  streak: number;
};

export function prettierLeaderboard(leaderboard: LeaderboardEntry[]): string {
  return leaderboard.reduce((acc, { username, points, streak }, index) => {
    const firstPart = `${index + 1}.️ ${streak > 0 ? '🔥' : ''} ${
      index < 6 ? '__' : ''
    }${streak} days${
      index < 6 ? '__' : ''
    } **${username}**: ${points} points\n`;
    return acc + firstPart;
  }, '');
}
