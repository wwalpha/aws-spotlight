import request from 'supertest';
import server from '../src/server';
import RESOURCE_DATAS from './datas/resources.json';

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
  test('Get service resource list', async () => {
    const response = await request(server).get('/resources/ec2').set({ Authorization: process.env.AUTU_TOKEN_ADMIN });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      items: RESOURCE_DATAS,
    });
  });
});
