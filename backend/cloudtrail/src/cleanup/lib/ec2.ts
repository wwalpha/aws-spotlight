import {
  DeleteCustomerGatewayCommand,
  DeleteInternetGatewayCommand,
  DeleteNatGatewayCommand,
  DeleteRouteTableCommand,
  DeleteSecurityGroupCommand,
  DeleteSnapshotCommand,
  DeleteSubnetCommand,
  DeleteTransitGatewayRouteTableCommand,
  DeleteVpcEndpointsCommand,
  DeleteVpnGatewayCommand,
  DeregisterImageCommand,
  DescribeImagesCommand,
  DescribeRouteTablesCommand,
  DescribeSecurityGroupsCommand,
  DescribeSnapshotsCommand,
  DescribeSubnetsCommand,
  EC2Client,
  TerminateInstancesCommand,
} from '@aws-sdk/client-ec2';

const ec2Client = new EC2Client();

export const security_group = async () => {
  const response = await ec2Client.send(new DescribeSecurityGroupsCommand());

  if (!response || !response.SecurityGroups) {
    return;
  }

  const tasks = response.SecurityGroups.map(async (sg) => {
    try {
      // delete unused security groups
      await ec2Client.send(
        new DeleteSecurityGroupCommand({
          GroupId: sg.GroupId,
        })
      );
    } catch (err) {
      // Ignore errors, such as when the security group is in use
      console.error(`Error deleting security group ${sg.GroupId}:`, err);
    }
  });

  await Promise.all(tasks);
};

export const subnet = async () => {
  const response = await ec2Client.send(new DescribeSubnetsCommand());

  if (!response || !response.Subnets) {
    return;
  }

  const tasks = response.Subnets.map(async (sb) => {
    try {
      // delete unused subnets
      await ec2Client.send(
        new DeleteSubnetCommand({
          SubnetId: sb.SubnetId,
        })
      );
    } catch (err) {
      // Ignore errors, such as when the subnet is in use
      console.error(`Error deleting subnet ${sb.SubnetId}:`, err);
    }
  });

  await Promise.all(tasks);
};

export const route_table = async () => {
  const response = await ec2Client.send(new DescribeRouteTablesCommand());

  if (!response || !response.RouteTables) {
    return;
  }

  const tasks = response.RouteTables.map(async (rt) => {
    try {
      // delete unused route tables
      await ec2Client.send(
        new DeleteRouteTableCommand({
          RouteTableId: rt.RouteTableId,
        })
      );
    } catch (err) {
      // Ignore errors, such as when the route table is in use
      console.error(`Error deleting route table ${rt.RouteTableId}:`, err);
    }
  });

  await Promise.all(tasks);
};

export const ami = async () => {
  const response = await ec2Client.send(
    new DescribeImagesCommand({
      Owners: ['self'],
      Filters: [
        {
          Name: 'state',
          Values: ['available'],
        },
      ],
    })
  );

  if (!response || !response.Images) {
    return;
  }

  const tasks = response.Images.filter((ami) => {
    const creationDate = new Date(ami.CreationDate || '');
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - creationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 90;
  }).map(async (ami) => {
    try {
      // delete unused AMIs
      await ec2Client.send(
        new DeregisterImageCommand({
          ImageId: ami.ImageId,
        })
      );
    } catch (err) {
      // Ignore errors, such as when the AMI is in use
      console.error(`Error deleting AMI ${ami.ImageId}:`, err);
    }
  });

  await Promise.all(tasks);
};

export const snapshots = async () => {
  const response = await ec2Client.send(
    new DescribeSnapshotsCommand({
      OwnerIds: ['self'],
    })
  );

  if (!response || !response.Snapshots) {
    return;
  }

  const tasks = response.Snapshots.filter((snapshot) => {
    const creationDate = new Date(snapshot.StartTime || '');
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - creationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 90;
  }).map(async (snapshot) => {
    try {
      // delete unused AMIs
      await ec2Client.send(
        new DeleteSnapshotCommand({
          SnapshotId: snapshot.SnapshotId,
        })
      );
    } catch (err) {
      // Ignore errors, such as when the snapshot is in use
      console.error(`Error deleting snapshot ${snapshot.SnapshotId}:`, err);
    }
  });

  await Promise.all(tasks);
};

/**
 * Terminates an EC2 instance by its instanceId.
 *
 * @param instanceId - The ID of the EC2 instance to terminate.
 */
export const terminateEC2Instance = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new EC2Client({ region });

  const instanceId = arn.split('/').pop();
  if (!instanceId) {
    return;
  }

  try {
    const command = new TerminateInstancesCommand({ InstanceIds: [instanceId] });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to terminate EC2 instance with id: ${instanceId}`, error);
  }
};

/**
 * Deletes a VPC Endpoint by its endpointId.
 *
 * @param endpointId - The ID of the VPC Endpoint to delete.
 */
export const deleteVpcEndpoint = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new EC2Client({ region });

  const endpointId = arn.split('/').pop();
  if (!endpointId) {
    return;
  }

  try {
    const command = new DeleteVpcEndpointsCommand({ VpcEndpointIds: [endpointId] });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete VPC Endpoint with id: ${endpointId}`, error);
  }
};

/**
 * Deletes a NAT Gateway by its natGatewayId.
 *
 * @param natGatewayId - The ID of the NAT Gateway to delete.
 */
export const deleteNatGateway = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new EC2Client({ region });

  const natGatewayId = arn.split('/').pop();
  if (!natGatewayId) {
    return;
  }

  try {
    const command = new DeleteNatGatewayCommand({ NatGatewayId: natGatewayId });
    // await client.send(command);
  } catch (error) {
    console.error(error);
  }
};
/**
 * Deletes an Internet Gateway by its internetGatewayId.
 *
 * @param internetGatewayId - The ID of the Internet Gateway to delete.
 */
export const deleteInternetGateway = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new EC2Client({ region });

  const internetGatewayId = arn.split('/').pop();
  if (!internetGatewayId) {
    return;
  }

  try {
    const command = new DeleteInternetGatewayCommand({ InternetGatewayId: internetGatewayId });
    // await client.send(command);
  } catch (error) {
    console.error(error);
  }
};
/**
 * Deletes a Customer Gateway by its customerGatewayId.
 *
 * @param customerGatewayId - The ID of the Customer Gateway to delete.
 */
export const deleteCustomerGateway = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new EC2Client({ region });

  const customerGatewayId = arn.split('/').pop();
  if (!customerGatewayId) {
    return;
  }

  try {
    const command = new DeleteCustomerGatewayCommand({ CustomerGatewayId: customerGatewayId });
    // await client.send(command);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Deletes a VPN Gateway by its vpnGatewayId.
 *
 * @param vpnGatewayId - The ID of the VPN Gateway to delete.
 */
export const deleteVpnGateway = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new EC2Client({ region });

  const vpnGatewayId = arn.split('/').pop();
  if (!vpnGatewayId) {
    return;
  }

  try {
    const command = new DeleteVpnGatewayCommand({ VpnGatewayId: vpnGatewayId });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete VPN Gateway with id: ${vpnGatewayId}`, error);
  }
};

/**
 * Deletes a Transit Gateway Route Table by its transitGatewayRouteTableId.
 *
 * @param transitGatewayRouteTableId - The ID of the Transit Gateway Route Table to delete.
 */
export const deleteTransitGatewayRouteTable = async (arn: string): Promise<void> => {
  const client = new EC2Client();

  const transitGatewayRouteTableId = arn.split('/').pop();
  if (!transitGatewayRouteTableId) {
    return;
  }

  try {
    const command = new DeleteTransitGatewayRouteTableCommand({
      TransitGatewayRouteTableId: transitGatewayRouteTableId,
    });
    // await client.send(command);
  } catch (error) {
    console.error(error);
  }
};
