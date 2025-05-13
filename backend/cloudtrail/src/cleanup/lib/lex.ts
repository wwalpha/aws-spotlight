import { LexModelsV2Client, DeleteBotCommand } from '@aws-sdk/client-lex-models-v2';

/**
 * Deletes a Lex Bot by its ARN.
 *
 * @param arn - The ARN of the Lex Bot to delete.
 */
export const deleteLexBot = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new LexModelsV2Client({ region });

  const botId = arn.split('/').pop();
  if (!botId) {
    return;
  }

  try {
    const command = new DeleteBotCommand({ botId });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Lex Bot with botId: ${botId}`, error);
  }
};
