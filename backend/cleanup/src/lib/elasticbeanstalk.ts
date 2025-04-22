import { ElasticBeanstalkClient, DeleteApplicationCommand } from '@aws-sdk/client-elastic-beanstalk';

/**
 * Deletes an Elastic Beanstalk application by its ARN.
 *
 * @param arn - The ARN of the Elastic Beanstalk application to delete.
 */
export const deleteElasticBeanstalkApplication = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new ElasticBeanstalkClient({ region });

  const applicationName = arn.split('/').pop();
  if (!applicationName) {
    return;
  }

  try {
    const command = new DeleteApplicationCommand({ ApplicationName: applicationName, TerminateEnvByForce: true });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Elastic Beanstalk application with applicationName: ${applicationName}`, error);
  }
};
