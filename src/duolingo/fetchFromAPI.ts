import axios from 'axios';

import { FAKE_USER_AGENT, users } from '../constants';
import { User } from './types';
import { XPSummaries } from './types';

function createHeaders() {
  return {
    Authorization: `Bearer ${process.env.DUOLINGO_JWT_API_TOKEN}`,
    'User-Agent': FAKE_USER_AGENT,
  };
}

function getUserUrl(id: string) {
  return `${process.env.DUOLINGO_API_BASE_URL}/users/${id}`;
}

function getXPSummariesUrl(id: string, startDate: string) {
  return `${getUserUrl(id)}/xp_summaries?startDate=${startDate}`;
}

function getLastWeekXP(inputData: XPSummaries): number {
  inputData.summaries.pop();
  return inputData.summaries.reduce(
    (acc: number, { gainedXp }: { gainedXp: number }) => acc + gainedXp,
    0,
  );
}

export async function getUser(id: string): Promise<User> {
  const url = getUserUrl(id);
  const response = await axios.get(url, {
    headers: createHeaders(),
  });
  const lastWeekXPUrl = getXPSummariesUrl(id, '2023-07-29');
  const lastWeekXPResponse = await axios.get(lastWeekXPUrl, {
    headers: createHeaders(),
  });
  lastWeekXPResponse.data.summaries.pop();
  return {
    ...response.data,
    lastWeekXP: getLastWeekXP(lastWeekXPResponse.data),
  };
}

export const getLeaderboard = async (): Promise<User[]> => {
  const leaderboard = await Promise.all(
    users.map(async (id) => {
      const user = await getUser(id);
      console.info(`Loaded user ${user.name}`);
      return user;
    }),
  );
  return leaderboard
    .sort((a, b) => b.lastWeekXP - a.lastWeekXP)
    .sort((a, b) => {
      if (a.lastWeekXP === b.lastWeekXP) {
        return b.streak - a.streak;
      }
      return 0;
    });
};
