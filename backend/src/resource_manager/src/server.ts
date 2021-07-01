import express from 'express';
import AWS from 'aws-sdk';
import { json, urlencoded } from 'body-parser';
import { audit, getCategoryList, getResourceList, healthCheck } from './app';
import { common } from './utils';

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
app.get('/resources/services/:service', async (req, res) => await common(req, res, getResourceList));
// get category list
app.get('/resources/categories', async (req, res) => await common(req, res, getCategoryList));
// get category list
app.get('/resources/audit', async (req, res) => await common(req, res, audit));

export default app;
