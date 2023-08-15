import { Request, Response } from 'express';
import { InteractionResponseType } from 'discord-interactions';

import { handleError } from '../utils';
import { getLeaderboard } from '../duolingo/fetchFromAPI';
import { postLeaderboardToChannel } from './messages';

async function initializeGenerationAndAnswer(channelId: string) {
  try {
    const leaderboard = await getLeaderboard();
    await postLeaderboardToChannel(leaderboard, channelId);
    console.info('Successfully generated and posted leaderboard');
  } catch (error) {
    handleError(
      'Error while handling trying to generate a leaderboard:',
      error,
    );
  }
}

export async function handleInteraction(req: Request, res: Response) {
  try {
    console.log('Received interaction');
    const message = req.body;
    void initializeGenerationAndAnswer(message.channel_id);
    res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'Here is the leaderboard!',
      },
    });
  } catch (error) {
    handleError('Error while handling Discord interaction:', error);
    return res.status(500).send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    });
  }
}
