import request from 'supertest';
import server from '../src/index';

describe('resource manager', () => {
  // Health Check
  test('Health check', async () => {
    const response = await request(server).get('/resource/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      service: 'Resource Manager',
      isAlive: true,
    });
  });

  // Get Service Resource List
  test('Get service resource list', async () => {
    const response = await request(server).get('/resource/ec2').auth('username', {
      type: 'bearer',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual([]);
  });
});
