import { DynamodbHelper } from '@alphax/dynamodb';
import jwt from 'jsonwebtoken';
import winston from 'winston';
import { APIGatewayRequestAuthorizerEventV2, APIGatewayRequestAuthorizerResultV2, Token, Tables } from 'typings';
import { getPublicKeys } from './utils';
import { Environments } from './consts';

const PEM_KEYS: Record<string, Record<string, string>> = {};
const helper = new DynamodbHelper();
const Logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'authorizer' },
  transports: [new winston.transports.Console()],
});

export const handler = async (
  event: APIGatewayRequestAuthorizerEventV2
): Promise<APIGatewayRequestAuthorizerResultV2> => {
  // value not found
  if (event.identitySource.length === 0) {
    return { isAuthorized: false };
  }

  // authorizator token
  const identitySource = event.identitySource[0];
  // decoded token
  const decodedToken = jwt.decode(identitySource, { complete: true });

  // decode failed
  if (decodedToken === null) {
    return { isAuthorized: false };
  }

  const token = decodedToken as Token;
  const iss = token.payload.iss;

  let pems: Record<string, string> | undefined = PEM_KEYS[iss];

  // not cached
  if (!pems) {
    pems = await getPublicKeys(iss);

    // not found public key
    if (!pems) {
      return { isAuthorized: false };
    }

    // cache public keys
    PEM_KEYS[iss] = pems;
  }

  const pem = pems[token.header.kid];

  try {
    // verify token
    jwt.verify(identitySource, pem, { issuer: iss });
  } catch (err) {
    Logger.error(err.name, err.message);

    return { isAuthorized: false };
  }

  // userid
  const email = token.payload.email;
  // get user role from db
  const user = await helper.get<Tables.UserItem>({
    TableName: Environments.TABLE_NAME_USER,
    Key: {
      UserId: email,
    } as Tables.UserKey,
  });

  // user not found
  if (!user || !user.Item) return { isAuthorized: false };

  const role = user.Item.Role;

  return { isAuthorized: true };
};