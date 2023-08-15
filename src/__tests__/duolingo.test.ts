import { prettierLeaderboard } from '../duolingo';
import { User } from '../types';

describe('prettierLeaderboard', () => {
  // Test that the function handles an empty leaderboard array and returns an empty string
  it('should return an empty string when leaderboard is empty', () => {
    const leaderboard: User[] = [];
    const result = prettierLeaderboard(leaderboard);
    expect(result).toEqual('');
  });

  // Test that the function handles a leaderboard array with a single user and returns a string with the user's data
  it('should return a string with the user data when leaderboard has one user', () => {
    const leaderboard = [{ name: 'John Doe', totalXp: 100, streak: 5 }];
    const result = prettierLeaderboard(leaderboard);
    expect(result).toEqual('1.️ 🔥 __5 days__   **John Doe**   100 XP\n');
  });

  // Test that the function handles a leaderboard array with users with the same streak and totalXp
  it('should return a string with users sorted by streak and then by totalXp when users have same streak and totalXp', () => {
    const leaderboard = [
      { name: 'John Doe', totalXp: 100, streak: 5 },
      { name: 'Jane Doe', totalXp: 100, streak: 5 },
      { name: 'Bob Smith', totalXp: 200, streak: 3 },
    ];
    const result = prettierLeaderboard(leaderboard);
    expect(result).toEqual(
      '1.️ 🔥 __5 days__   **John Doe**   100 XP\n2.️ 🔥 __5 days__   **Jane Doe**   100 XP\n3.️ 🔥 __3 days__   **Bob Smith**   200 XP\n',
    );
  });

  // Test that the function handles a leaderboard array with users with negative streaks and totalXp
  it('should return a string with users sorted by streak and then by totalXp when users have negative streak and totalXp', () => {
    const leaderboard = [
      { name: 'John Doe', totalXp: -100, streak: -5 },
      { name: 'Jane Doe', totalXp: -100, streak: -5 },
      { name: 'Bob Smith', totalXp: -200, streak: -3 },
    ];
    const result = prettierLeaderboard(leaderboard);
    expect(result).toEqual(
      '1.️  __-5 days__   **John Doe**   -100 XP\n2.️  __-5 days__   **Jane Doe**   -100 XP\n3.️  __-3 days__   **Bob Smith**   -200 XP\n',
    );
  });

  // Test that the function handles a leaderboard array with users with zero streaks and totalXp
  it('should return a string with users sorted by streak and then by totalXp when users have zero streak and totalXp', () => {
    const leaderboard = [
      { name: 'John Doe', totalXp: 0, streak: 0 },
      { name: 'Jane Doe', totalXp: 0, streak: 0 },
      { name: 'Bob Smith', totalXp: 0, streak: 0 },
    ];
    const result = prettierLeaderboard(leaderboard);
    expect(result).toEqual(
      '1.️  __0 days__   **John Doe**   0 XP\n2.️  __0 days__   **Jane Doe**   0 XP\n3.️  __0 days__   **Bob Smith**   0 XP\n',
    );
  });
});
