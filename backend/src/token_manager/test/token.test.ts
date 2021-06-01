import axios, { AxiosStatic } from 'axios';
import request from 'supertest';
import server from '../src/server';
import { User } from 'typings';

jest.mock('axios');

const api = axios as jest.Mocked<AxiosStatic>;

const TOKEN =
  'eyJraWQiOiJ6ZDhJZnhXYkJ6ck9EUjd4S21STEVZWFJPVzJURGxmQ1BnZTVxR0FROExnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4OTQ0NGJmNi0xM2YzLTRiYWYtYjAxYi02ODBjNzJmZGRiY2QiLCJhdWQiOiJyODc4YjZuZmt0MHZsNGZzYnBzbWxwMTR0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiYTA1ZjU1YmItODM5Ni00OWYwLThmMzctNTM3M2NkYTMwN2E5IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MjE5NDI0MTksImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tXC9hcC1ub3J0aGVhc3QtMV9hOUk2UDFRalIiLCJjb2duaXRvOnVzZXJuYW1lIjoid3dhbHBoYUBnbWFpbC5jb20iLCJleHAiOjE2MjE5NDYwMTksImlhdCI6MTYyMTk0MjQxOSwiZW1haWwiOiJ3d2FscGhhQGdtYWlsLmNvbSJ9.A7n_Pz7aWeB9xAx3JonJ2HKBsjUMvGWsSUhpXt70-RyG8sjrR2nbtSIBG_KJTfg26gSUGDKvs2IiBTXPToFW3trIHhjzuotwuxkOtiN1Lq6yqtOxioLyJ2m4TlG73p79jLDjxnJJlMtALSD9lmqYzQ9K8whMRQAE4TGo0Tv3Wr00vVlgFpWIiZiu1EqB8KN83XSt3vNf3UTJKO9dODmmPSCrcPfVSLecorlnFwPaqUOrSVVmamlDfesxusr1fy6iaFv3xjNunAVN8DEFzu3MDfP0GeSfFIKPiStDDnYurp7YiDg0KNSWiuHmFXBxzzmehWYJ9-P8waz4uNuaadjc4Q';

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
    expect(response.text).toBe("Invalid token specified: Cannot read property 'replace' of undefined");
  });

  test('token error2', async () => {
    const response = await request(server).get('/token/decode').auth('BEARER TOKEN', { type: 'bearer' });

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("Invalid token specified: Cannot read property 'replace' of undefined");
  });
});
