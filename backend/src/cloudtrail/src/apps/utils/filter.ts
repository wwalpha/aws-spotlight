import { CloudTrail } from 'typings';

const ALLOW_REGIONS = process.env.ALLOW_REGIONS || 'us-east-1';

export const filterRegion = async (events: CloudTrail.Record[]) => {
  const regions = ALLOW_REGIONS.split(',');

  const notAllowed = events.filter((item) => !regions.includes(item.awsRegion));

  let username;

  notAllowed.map((item) => {
    switch (item.userIdentity.type) {
      case 'IAMUser':
        username = item.userIdentity.sessionContext.sessionIssuer.userName;

        // sendSNS()
        break;
      case 'Root':
      case 'AssumedRole':
      case 'FederatedUser':
      case 'AWSAccount':
      case 'AWSService':
        break;
    }
  });
};
