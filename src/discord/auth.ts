import axios from 'axios';

type DiscordCredentials = {
  access_token: string;
  scope: string;
};

export async function getDiscordCredentials(): Promise<DiscordCredentials> {
  const response = await axios.post<DiscordCredentials>(
    'https://discord.com/api/v10/oauth2/token',
    {
      grant_type: 'client_credentials',
      scope: 'applications.commands.update identify',
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.DISCORD_APPLICATION_ID}:${process.env.DISCORD_CLIENT_SECRET}`,
        ).toString('base64')}`,
      },
    },
  );
  console.log(response.data);
  return response.data;
}
