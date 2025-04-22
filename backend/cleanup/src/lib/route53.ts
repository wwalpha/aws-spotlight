import { Route53Client, DeleteHostedZoneCommand } from '@aws-sdk/client-route-53';
import { Route53Profiles, DeleteProfileCommand } from '@aws-sdk/client-route53profiles';

/**
 * Deletes a Route53 Hosted Zone by its ARN.
 *
 * @param arn - The ARN of the Route53 Hosted Zone to delete.
 */
export const deleteRoute53HostedZone = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new Route53Client({ region });

  const hostedZoneId = arn.split('/').pop();
  if (!hostedZoneId) {
    return;
  }

  try {
    const command = new DeleteHostedZoneCommand({ Id: hostedZoneId });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Route53 Hosted Zone with hostedZoneId: ${hostedZoneId}`, error);
  }
};

/**
 * Deletes a Route53 Traffic Policy by its ID and version.
 *
 * @param trafficPolicyId - The ID of the Traffic Policy to delete.
 * @param trafficPolicyVersion - The version of the Traffic Policy to delete.
 */
export const deleteRoute53Profile = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new Route53Profiles({ region });

  const profileId = arn.split('/').pop();
  if (!profileId) {
    return;
  }

  try {
    const command = new DeleteProfileCommand({
      ProfileId: profileId,
    });
    await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Route53 Profile with ID: ${profileId}`, error);
  }
};
