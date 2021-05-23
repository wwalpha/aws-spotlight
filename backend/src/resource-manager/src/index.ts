import express from 'express';
import AWS from 'aws-sdk';
import { json, urlencoded } from 'body-parser';
import winston from 'winston';
import { getResourceList, healthCheck } from './app';

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
app.get('/resources/health', healthCheck);
// get resource list
app.get('/resources/:service', getResourceList);

// Start the servers
app.listen(8080, () => {
  console.log('Resource manager service started on port 8080');
  console.log(process.env);
});

export default app;
