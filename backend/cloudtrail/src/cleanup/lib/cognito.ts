import { CognitoIdentityClient, DeleteIdentityPoolCommand } from '@aws-sdk/client-cognito-identity';
import { CognitoIdentityProviderClient, DeleteUserPoolCommand } from '@aws-sdk/client-cognito-identity-provider';

/**
 * Deletes a Cognito Identity Pool by its ID.
 *
 * @param identityPoolId - The ID of the Cognito Identity Pool to delete.
 */
export const deleteCognitoIdentityPool = async (identityPoolId: string): Promise<void> => {
  const client = new CognitoIdentityClient();

  try {
    const command = new DeleteIdentityPoolCommand({ IdentityPoolId: identityPoolId });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Cognito Identity Pool with ID: ${identityPoolId}`, error);
  }
};

/**
 * Deletes a Cognito User Pool by its ARN.
 *
 * @param arn - The ARN of the Cognito User Pool to delete.
 */
export const deleteCognitoUserPool = async (arn: string): Promise<void> => {
  const region = arn.split(':')[3];
  const client = new CognitoIdentityProviderClient({ region });

  const userPoolId = arn.split('/').pop();
  if (!userPoolId) {
    return;
  }

  try {
    const command = new DeleteUserPoolCommand({ UserPoolId: userPoolId });
    // await client.send(command);
  } catch (error) {
    console.error(`Failed to delete Cognito User Pool with userPoolId: ${userPoolId}`, error);
  }
};
