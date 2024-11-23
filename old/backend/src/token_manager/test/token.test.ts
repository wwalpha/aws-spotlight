import axios, { AxiosStatic } from 'axios';
import request from 'supertest';
import server from '../src/server';
import { User } from 'typings';

jest.mock('axios');

const api = axios as jest.Mocked<AxiosStatic>;

const TOKEN =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vYXAtbm9ydGhlYXN0LUFBQUFBQUFBQUFBIiwiY2xpZW50X2lkIjoiYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWEiLCJpYXQiOjE2MjQ0MDEyOTB9.V7Hl0Y9YF57phvSpvxNjO8yL19gKyBCKa45akVUG6_uEX-lmzGbm_fuO3A8GlaeQRZ4mSpAmk_Q7ACT-Co0YzufQQ38wE7tnTc8DAXpYrWuMJEBMb44tSRJHD7CvDFW6cTl-yVvAh2i-xYF3Ua2sW8T9NluFOJe-9OZ841o5_EY';

describe('token manager', () => {
  test('health check', async () => {
    const response = await request(server).get('/token/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      service: 'Token Manager',
      isAlive: true,
    });
  });

  test('decode', async () => {
    const user: User.GetUserResponse = require('./expect/Decode.json');
    api.get.mockResolvedValueOnce({ status: 200, data: user });

    const response = await request(server).get('/token/decode').auth(TOKEN, { type: 'bearer' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(user);
  });

  test('token error1', async () => {
    const response = await request(server).get('/token/decode').auth('TOKEN', { type: 'bearer' });

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe('Decode token failed. TOKEN');
  });

  test('token error2', async () => {
    const response = await request(server).get('/token/decode').auth('BEARER TOKEN', { type: 'bearer' });

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe('Decode token failed. BEARER TOKEN');
  });
});
