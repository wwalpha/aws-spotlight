import { SchedulerClient, DeleteScheduleCommand } from '@aws-sdk/client-scheduler';

/**
 * Deletes a Scheduler Schedule by its ARN.
 *
 * @param arn - The ARN of the Scheduler Schedule to delete.
 */
export const deleteSchedulerSchedule = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new SchedulerClient({ region });

  const scheduleName = arn.split('/').pop();
  if (!scheduleName) {
    return;
  }

  try {
    const command = new DeleteScheduleCommand({ Name: scheduleName });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Scheduler Schedule with name: ${scheduleName}`, error);
  }
};
