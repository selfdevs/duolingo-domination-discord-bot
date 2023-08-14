import { BASE_URL, USER_ENDPOINT, users } from './constants';
import axios from 'axios';
import { User } from './types';
import { handleAxiosError } from './axios';

export async function getUser(username: string): Promise<User> {
  const url = BASE_URL + USER_ENDPOINT + username;
  try {
    const response = await axios.get<User>(url, {
      headers: {
        Authorization: `Bearer ${process.env.DUOLINGO_JWT_API_TOKEN}`,
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/85.0.4183.83 Chrome/85.0.4183.83 Safari/537.36',
      },
    });
    console.log('got user', username);
    return response.data;
  } catch (error) {
    console.log('error getting user', username);
    handleAxiosError(error);
    return {
      language_data: {
        fr: {
          points: 0,
          streak: 0,
        },
      },
    };
  }
}

export const getLeaderboard = async (channelId: string): Promise<void> => {
  console.log('getting leaderboard');
  const leaderboard = await Promise.all(
    users.map(async (username) => {
      const user = await getUser(username);
      console.log('got user', username);
      return {
        username,
        points: sumPoints(user),
        streak: getBestStreak(user),
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
        content: prettierLeaderboard(sortedLeaderboard),
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

function sumPoints(user: User) {
  return Object.values(user.language_data).reduce((total, { points }) => {
    return total + points;
  }, 0);
}

function getBestStreak(user: User) {
  return Object.values(user.language_data).reduce((bestStreak, { streak }) => {
    return Math.max(bestStreak, streak);
  }, 0);
}

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
