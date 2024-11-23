import express from 'express';
import AWS from 'aws-sdk';
import { json, urlencoded } from 'body-parser';
import { common, decode, healthCheck } from './app';

AWS.config.update({
  region: process.env.AWS_REGION,
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
});

// Instantiate application
var app = express();

// Configure middleware
app.use(json());
app.use(
  urlencoded({
    extended: false,
  })
);

// health check
app.get('/token/health', healthCheck);
// get resource list
app.get('/token/decode', async (req, res) => await common(req, res, decode));

export default app;
