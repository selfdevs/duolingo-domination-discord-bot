import { config } from 'dotenv';
import express from 'express';
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { getDiscordCredentials } from './discordCredentials';
import axios from 'axios';
import { handleAxiosError } from './axios';
import { getLeaderboard, prettierLeaderboard } from './duolingo';

config();

const app = express();

app.post(
  '/interactions',
  verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY as string),
  async (req, res) => {
    try {
      console.log('interactions endpoint called');
      const message = req.body;
      getLeaderboard(message.channel_id);
      if (message.type === InteractionType.APPLICATION_COMMAND) {
        console.log('interaction type is APPLICATION_COMMAND');
      }
      res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Wait a second...',
        },
      });
    } catch (error) {
      handleAxiosError(error);
      return res.status(500).send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      });
    }
  },
);

async function init() {
  console.log('Initializing...');
  try {
    const { access_token } = await getDiscordCredentials();
    const url = `https://discord.com/api/v10/applications/${process.env.DISCORD_APPLICATION_ID}/commands`;
    await axios.post(
      url,
      {
        name: 'duo',
        description: 'Get the leaderboard',
        type: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log('Initialization done!');
  } catch (error) {
    handleAxiosError(error);
  }
}

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  void init();
  console.log(`Server is running on port ${PORT}`);
});
