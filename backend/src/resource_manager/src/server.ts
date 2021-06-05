import express from 'express';
import AWS from 'aws-sdk';
import { json, urlencoded } from 'body-parser';
import { getResourceList, healthCheck } from './app';

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
app.get('/resources/health', healthCheck);
// get resource list
app.get('/resources/:service', getResourceList);

export default app;
