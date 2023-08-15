import { verifyKeyMiddleware } from 'discord-interactions';
import { config } from 'dotenv';
import express from 'express';

import { handleError } from './utils';
import { createDiscordCommand } from './discord/commands';
import { handleInteraction } from './discord/interations';

config();

const app = express();

app.post(
  '/interactions',
  verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY as string),
  handleInteraction,
);

async function init() {
  console.log('Initialisation started');
  try {
    await createDiscordCommand({
      name: 'duo',
      description: 'Get the leaderboard',
      type: 1,
    });
    console.info('Initialization complete');
  } catch (error) {
    handleError('Error during initialisation:', error);
  }
}

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  void init();
  console.log(`Server is running on port ${PORT}`);
});
