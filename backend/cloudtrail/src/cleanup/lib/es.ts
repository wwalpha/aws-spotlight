import { ElasticsearchServiceClient, DeleteElasticsearchDomainCommand } from '@aws-sdk/client-elasticsearch-service';

/**
 * Deletes an Elasticsearch Domain by its ARN.
 *
 * @param arn - The ARN of the Elasticsearch Domain to delete.
 */
export const deleteElasticsearchDomain = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new ElasticsearchServiceClient({ region });

  const domainName = arn.split('/').pop();
  if (!domainName) {
    return;
  }

  try {
    const command = new DeleteElasticsearchDomainCommand({ DomainName: domainName });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Elasticsearch Domain with domainName: ${domainName}`, error);
  }
};
