import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { DynamodbHelper } from '@alphax/dynamodb';
import axios from 'axios';

const helper = new DynamodbHelper();

export const decodeToken = (token: string) => {
  // Fail if the token is not jwt
  const decodedJwt = jwt.decode(token, { complete: true });

  if (decodedJwt === null) {
    console.log('Not a valid JWT token');
    return;
  }

  return decodedJwt;
};

/**
 * Get public keys
 *
 * @param iss issuer
 * @returns
 */
export const getPublicKeys = async (iss: string): Promise<Record<string, string> | undefined> => {
  const response = await axios.get(iss + '/.well-known/jwks.json');

  if (response.status !== 200) {
    return;
  }

  const keys = response.data['keys'];
  const pems: Record<string, string> = {};

  for (let i = 0; i < keys.length; i++) {
    //Convert each key to PEM
    const key_id = keys[i].kid;
    const modulus = keys[i].n;
    const exponent = keys[i].e;
    const key_type = keys[i].kty;
    const jwk = { kty: key_type, n: modulus, e: exponent };
    const pem = jwkToPem(jwk);

    pems[key_id] = pem;
  }

  return pems;
};
// export const validateIssForTenant = async (token?: string) => {
//   console.log('Validating iss from token against tenant db');

//   var decodedToken = decodeToken(token);

//   if (!decodedToken) return;

//   console.log('this is the iss');

//   var iss = decodedToken.payload.iss;
//   var n = iss.lastIndexOf('/');
//   var iss_uip = iss.substring(n + 1);

//   console.log(iss_uip);

//   console.log('this is the tenantid');
//   const tenantid = decodedToken.payload['custom:tenant_id'];

//   console.log(tenantid);

//   const result = await helper.get({
//     TableName: process.env.TENANT_DB as string,
//     Key: {
//       id: tenantid,
//     },
//   });

//   console.log('Tenant Record:', result);
//   console.log('Tenant UserPoolId:', result?.Item.UserPoolId.S);
//   console.log('Iss UserPoolId:', iss_uip);

//   if (result?.Item.UserPoolId.S === iss_uip) {
//     return result;
//   } else {
//     throw new Error('iss does not match tenant record');
//   }
// };

export const validateToken = (pems: Record<string, string>, token: string) => {
  // Fail if the token is not jwt
  const decodedJwt = jwt.decode(token, { complete: true });
  const iss = decodedJwt?.payload.iss;
  const n = iss.lastIndexOf('/');
  const resultUserPoolId = iss.substring(n + 1);

  if (!decodedJwt) {
    throw new Error('Not a valid JWT token');
  }

  //Fail if token is not from your UserPool
  if (decodedJwt.payload.iss != iss) {
    throw new Error('Invalid issuer');
  }

  //Reject the jwt if it's not an 'Access Token'
  if (decodedJwt.payload.token_use != 'id') {
    throw new Error('Not an access token');
  }

  //Get the kid from the token and retrieve corresponding PEM
  var kid = decodedJwt.header.kid;
  var pem = pems[kid];

  if (!pem) {
    throw new Error('Invalid access token');
  }

  // Verify the signature of the JWT token to ensure it's really coming from your User Pool
  try {
    const payload = jwt.verify(token, pem, { issuer: iss });

    //Valid token. Generate the API Gateway policy for the user
    //Always generate the policy on value of 'sub' claim and not for 'username' because username is reassignable
    //sub is UUID for a user which is never reassigned to another user.
    // const principalId = payload.sub;

    // //Get AWS AccountId and API Options
    // const apiOptions = {};
    // const tmp = event.methodArn.split(':');
    // const apiGatewayArnTmp = tmp[5].split('/');

    // const awsAccountId = tmp[4];
    // apiOptions.region = tmp[3];
    // apiOptions.restApiId = apiGatewayArnTmp[0];
    // apiOptions.stage = apiGatewayArnTmp[1];

    // const method = apiGatewayArnTmp[2];
    // const resource = '/'; // root resource
    // if (apiGatewayArnTmp[3]) {
    //   resource += apiGatewayArnTmp[3];
    // }
    // //For more information on specifics of generating policy, refer to blueprint for API Gateway's Custom authorizer in Lambda console
    // const policy = new AuthPolicy(principalId, awsAccountId, apiOptions);
    // policy.allowAllMethods();
    // const authResponse = policy.build();
    // // Can optionally return a context object of your choosing.
    // authResponse.context = {};
    // authResponse.context.tenant_id = decodedJwt.payload['custom:tenant_id'];
    // authResponse.context.sub = decodedJwt.payload['sub'];
    // authResponse.context.username = decodedJwt.payload['cognito:username'];
    // authResponse.context.given_name = decodedJwt.payload['given_name'];
    // authResponse.context.family_name = decodedJwt.payload['family_name'];
    // authResponse.context.role = decodedJwt.payload['custom:role'];
    // authResponse.context.UserPoolId = resultUserPoolId;
  } catch (err) {
    throw new Error('Cannot Verify Signature');
  }
};
