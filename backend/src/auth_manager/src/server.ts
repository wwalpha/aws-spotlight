import AWS from 'aws-sdk';
import express from 'express';
import { json, urlencoded } from 'body-parser';
import { auth, common, healthCheck, release, version } from './app';

AWS.config.update({
  region: process.env.AWS_REGION,
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

// Instantiate application
const app = express();

// Configure middleware
app.use(json());
app.use(
  urlencoded({
    extended: false,
  })
);

// health check
app.get('/auth/health', async (req, res) => await common(req, res, healthCheck));

// process login request
app.post('/auth', async (req, res) => await common(req, res, auth));

// get system version no
app.get('/system/version', async (req, res) => await common(req, res, version));

// get release information
app.get('/system/releases', async (req, res) => await common(req, res, release));

export default app;
