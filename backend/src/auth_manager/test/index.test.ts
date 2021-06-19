import axios, { AxiosStatic } from 'axios';
import request from 'supertest';
import server from '../src/server';
import { User, Auth, System } from 'typings';
import { DynamodbHelper } from '@alphax/dynamodb';
import Releases from './expect/releases.json';

jest.mock('axios');
jest.mock('amazon-cognito-identity-js');

const api = axios as jest.Mocked<AxiosStatic>;
const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

describe('auth manager', () => {
  test('health check', async () => {
    const response = await request(server).get('/auth/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      service: 'Auth Manager',
      isAlive: true,
    });
  });

  test.skip('login', async () => {
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

  test('release', async () => {
    const response = await request(server).get('/system/releases');

    expect(response.body).toEqual(Releases);
  });

  test('version', async () => {
    const response = await request(server).get('/system/version');

    expect(response.body).toEqual({
      version: 'v0.2.1',
    } as System.VersionResponse);
  });
});
