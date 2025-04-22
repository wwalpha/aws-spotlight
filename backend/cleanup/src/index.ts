import { ami, route_table, security_group, snapshots, subnet } from './lib/ec2';
import { iam_user } from './iam';

export const handler = async () => {
  // ec2 commons
  await security_group();
  await subnet();
  await route_table();
  await ami();
  await snapshots();

  // iam commons
  await iam_user();
};

// handler();
