import {
  DeleteLoginProfileCommand,
  DeleteUserCommand,
  DetachUserPolicyCommand,
  GenerateCredentialReportCommand,
  GetCredentialReportCommand,
  IAMClient,
  ListAttachedUserPoliciesCommand,
  ListGroupsForUserCommand,
  RemoveUserFromGroupCommand,
  DeleteRoleCommand,
} from '@aws-sdk/client-iam';

const iamClient = new IAMClient();

export const iam_user = async () => {
  const response = await iamClient.send(
    new GenerateCredentialReportCommand({
      ReportFormat: 'text',
    })
  );

  while (response.State !== 'COMPLETE') {
    console.log('Waiting for report generation...');
    await new Promise((res) => setTimeout(res, 3000));
  }

  const report = await iamClient.send(new GetCredentialReportCommand());
  const reportData = Buffer.from(report.Content as Uint8Array).toString('utf-8');

  const lines = reportData.split('\n');
  const headers = lines[0].split(',');

  const dataRows = lines.slice(1).filter((line) => {
    const values = line.split(',');
    const pswLastUsed = values[headers.indexOf('password_last_used')];
    const pswEnabled = values[headers.indexOf('password_enabled')];
    const arn = values[headers.indexOf('arn')];

    if (pswEnabled === 'false') {
      return false;
    }
    if (pswLastUsed === 'N/A' || pswLastUsed === 'no_information') {
      return false;
    }

    if (arn !== undefined && !arn.startsWith('arn:aws:iam::334678299258:user')) {
      return false;
    }

    const lastUsedDate = new Date(pswLastUsed);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - lastUsedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 365) {
      return false;
    }

    return true;
  });

  const tasks = dataRows.map(async (row) => {
    const values = row.split(',');
    const userName = values[headers.indexOf('user')];

    console.log(`Deleting IAM user: ${userName}`);

    try {
      // delete login profile
      // This is needed to delete the user
      await iamClient.send(new DeleteLoginProfileCommand({ UserName: userName }));
    } catch (e) {}

    // ポリシーのデタッチ
    const policies = await iamClient.send(new ListAttachedUserPoliciesCommand({ UserName: userName }));
    for (const policy of policies.AttachedPolicies || []) {
      await iamClient.send(new DetachUserPolicyCommand({ UserName: userName, PolicyArn: policy.PolicyArn }));
    }

    const groups = await iamClient.send(new ListGroupsForUserCommand({ UserName: userName }));
    for (const group of groups.Groups || []) {
      await iamClient.send(new RemoveUserFromGroupCommand({ UserName: userName, GroupName: group.GroupName }));
    }

    await iamClient.send(new DeleteUserCommand({ UserName: userName }));
  });

  await Promise.all(tasks);
};
