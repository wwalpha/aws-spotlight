import request from 'supertest';
import { sign } from 'jsonwebtoken';
import * as fs from 'fs';
import server from '../src/server';
import CATEGORIES_ADMIN from './expect/categories_admin.json';
import CATEGORIES_USER from './expect/categories_user.json';
import RESOURCE_ADMIN from './expect/resources_admin.json';
import RESOURCE_USER from './expect/resources_user.json';
import { Resource } from 'typings';

const userIdToken = sign(
  {
    'custom:role': 'TENANT_USER',
    'cognito:username': 'test001@gmail.com',
  },
  fs.readFileSync('./test/configs/private.key'),
  { algorithm: 'RS256' }
);

const adminIdToken = sign(
  {
    'custom:role': 'TENANT_ADMIN',
    'cognito:username': 'admin',
  },
  fs.readFileSync('./test/configs/private.key'),
  { algorithm: 'RS256' }
);

describe('resource manager', () => {
  // Health Check
  test('Health check', async () => {
    const response = await request(server).get('/resources/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      service: 'Resource Manager',
      isAlive: true,
    });
  });

  // Get Service Resource List
  test('Get service resource list (admin)', async () => {
    const response = await request(server).get('/resources/services/ec2').set({ Authorization: adminIdToken });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      items: RESOURCE_ADMIN,
    });
  });

  // Get Service Resource List
  test('Get service resource list (user)', async () => {
    const userIdToken = sign(
      {
        'custom:role': 'TENANT_USER',
        'cognito:username': 'test003@gmail.com',
      },
      fs.readFileSync('./test/configs/private.key'),
      { algorithm: 'RS256' }
    );

    const response = await request(server).get('/resources/services/ec2').set({ Authorization: userIdToken });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      items: RESOURCE_USER,
    } as Resource.GetResourceResponse);
  });

  // Get Service Resource List
  test('Get category list (admin)', async () => {
    const response = await request(server).get('/resources/categories').set({ Authorization: adminIdToken });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(CATEGORIES_ADMIN);
  });

  // Get Service Resource List
  test('Get category list (user)', async () => {
    const response = await request(server).get('/resources/categories').set({ Authorization: userIdToken });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(CATEGORIES_USER);
  });
});
