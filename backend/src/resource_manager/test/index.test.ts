import request from 'supertest';
import server from '../src/server';
import CATEGORIES_ADMIN from './datas/categories_admin.json';
import CATEGORIES_USER from './datas/categories_user.json';
import RESOURCE_ADMIN from './datas/resources_admin.json';
import RESOURCE_USER from './datas/resources_user.json';
import { Resource } from 'typings';

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
    const response = await request(server)
      .get('/resources/services/ec2')
      .set({ Authorization: process.env.AUTU_TOKEN_ADMIN });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      items: RESOURCE_ADMIN,
    });
  });

  // Get Service Resource List
  test('Get service resource list (user)', async () => {
    const response = await request(server)
      .get('/resources/services/ec2')
      .set({ Authorization: process.env.AUTU_TOKEN_USER });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      items: RESOURCE_USER,
    } as Resource.GetResourceResponse);
  });

  // Get Service Resource List
  test('Get category list (admin)', async () => {
    const response = await request(server)
      .get('/resources/categories')
      .set({ Authorization: process.env.AUTU_TOKEN_ADMIN });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(CATEGORIES_ADMIN);
  });

  // Get Service Resource List
  test('Get category list (user)', async () => {
    const response = await request(server)
      .get('/resources/categories')
      .set({ Authorization: process.env.AUTU_TOKEN_USER });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(CATEGORIES_USER);
  });
});
