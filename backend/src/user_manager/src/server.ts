import express from 'express';
import { json, urlencoded } from 'body-parser';
import { createUser, healthCheck, createAdminUser, lookupUser } from './app';
import { common } from './utils';

// instantiate application
const app = express();

// configure middleware
app.use(json());
app.use(urlencoded({ extended: false }));

// health check
app.get('/user/health', async (req, res) => await common(req, res, healthCheck));

// create a admin user
app.post('/user/admin', async (req, res) => await common(req, res, createAdminUser));

// Lookup user pool for any user - no user data returned
app.get('/user/pool/:id', async (req, res) => await common(req, res, lookupUser));

// create a normal user
app.post('/user', async (req, res) => await common(req, res, createUser));

export default app;
