import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { mocked } from 'ts-jest/utils';
import request from 'supertest';
import { User } from 'typings';
import Server from '../src/server';

describe('user manager', () => {
  test('get /users/health', async () => {
    const response = await request(Server).get('/users/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      service: 'User Manager',
      isAlive: true,
    });
  });

  test('get /users/admins', async () => {
    mocked(CognitoIdentityServiceProvider).prototype.listUsers = jest.fn().mockImplementationOnce(() => ({
      promise: () =>
        Promise.resolve({
          Users: [
            { Attributes: [{ Name: 'name', Value: 'test001@test.com' }] },
            { Attributes: [{ Name: 'name', Value: 'test002@test.com' }] },
          ],
        }),
    }));

    const response = await request(Server).get('/users/admins');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      users: ['test001@test.com', 'test002@test.com'],
    } as User.ListAdminUsersResponse);
  });
});
