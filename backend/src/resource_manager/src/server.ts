import express from 'express';
import AWS from 'aws-sdk';
import { json, urlencoded } from 'body-parser';
import { getCategoryList, getResourceList, healthCheck } from './app';
import { auditRegion } from './func';
import { common } from './utils';

AWS.config.update({
  region: process.env.AWS_REGION,
  dynamodb: { endpoint: process.env.AWS_ENDPOINT },
  sns: { endpoint: process.env.AWS_ENDPOINT },
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
app.get('/resources/audit/region', async (req, res) => await common(req, res, auditRegion));
// get category list
app.get('/resources/reports', async (req, res) => await common(req, res, auditRegion));

export default app;
