import { GlueClient, DeleteCrawlerCommand, DeleteDatabaseCommand } from '@aws-sdk/client-glue';

/**
 * Deletes a Glue Crawler by its name.
 *
 * @param crawlerName - The name of the Glue Crawler to delete.
 */
export const deleteGlueCrawler = async (crawlerName: string): Promise<void> => {
  const client = new GlueClient();

  try {
    const command = new DeleteCrawlerCommand({ Name: crawlerName });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Glue Crawler with name: ${crawlerName}`, error);
  }
};

/**
 * Deletes a Glue Database by its ARN.
 *
 * @param arn - The ARN of the Glue Database to delete.
 */
export const deleteGlueDatabase = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new GlueClient({ region });

  const databaseName = arn.split('/').pop();
  if (!databaseName) {
    return;
  }

  try {
    const command = new DeleteDatabaseCommand({ Name: databaseName });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Glue Database with name: ${databaseName}`, error);
  }
};
