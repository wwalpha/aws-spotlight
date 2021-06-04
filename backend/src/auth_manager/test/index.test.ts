import axios, { AxiosStatic } from 'axios';
import request from 'supertest';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { mocked } from 'ts-jest/utils';
import server from '../src/server';
import { User, Auth } from 'typings';

jest.mock('axios');
jest.mock('amazon-cognito-identity-js');

const api = axios as jest.Mocked<AxiosStatic>;

describe('auth manager', () => {
  test('health check', async () => {
    const response = await request(server).get('/token/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      service: 'Auth Manager',
      isAlive: true,
    });
  });

  test.only('login', async () => {
    // mocked(CognitoUser, true).mockImplementationOnce((data) => {
    //   console.log(12223333, data);
    //    new CognitoUser(data);
    // });

    api.get.mockResolvedValueOnce({
      status: 200,
      data: {
        isExist: true,
        clientId: 'ClientID',
        userPoolId: 'UserPoolId',
        identityPoolId: 'IdentityPoolId',
      } as User.LookupUserResponse,
    });

    const response = await request(server)
      .post('/auth')
      .send({
        username: 'test001',
        password: 'password001',
      } as Auth.SignInRequest);
  });
});
