import {
  CloudFrontClient,
  GetDistributionConfigCommand,
  UpdateDistributionCommand,
  DeleteDistributionCommand,
} from '@aws-sdk/client-cloudfront';

/**
 * Deletes a CloudFront distribution by its ARN.
 *
 * @param arn - The ARN of the CloudFront distribution to delete.
 */
export const deleteCloudFrontDistribution = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new CloudFrontClient({ region });

  const distributionId = arn.split('/').pop();
  if (!distributionId) {
    return;
  }

  try {
    const getConfigCommand = new GetDistributionConfigCommand({ Id: distributionId });
    const { ETag, DistributionConfig } = await client.send(getConfigCommand);

    if (DistributionConfig?.Enabled) {
      DistributionConfig.Enabled = false;
      const updateCommand = new UpdateDistributionCommand({
        Id: distributionId,
        IfMatch: ETag,
        DistributionConfig,
      });
      await client.send(updateCommand);
    }

    const deleteCommand = new DeleteDistributionCommand({ Id: distributionId, IfMatch: ETag });
    await client.send(deleteCommand);
  } catch (error) {
    console.error(`Failed to delete CloudFront distribution with distributionId: ${distributionId}`, error);
  }
};
