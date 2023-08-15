export function createEmbed(title: string, description: string) {
  return {
    embeds: [
      {
        title,
        description,
      },
    ],
  };
}
