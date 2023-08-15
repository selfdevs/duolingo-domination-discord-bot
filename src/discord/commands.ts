import axios from 'axios';
import {
  generateClientCredentialsHeaders,
  getDiscordCredentials,
} from './auth';

type DiscordCommand = {
  name: string;
  description: string;
  type: number;
};

export async function createDiscordCommand(command: DiscordCommand) {
  const { access_token } = await getDiscordCredentials();
  const url = `https://discord.com/api/v10/applications/${process.env.DISCORD_APPLICATION_ID}/commands`;
  await axios.post(url, command, {
    headers: generateClientCredentialsHeaders(access_token),
  });
  console.info(`Discord command ${command.name} successfully created`);
}
