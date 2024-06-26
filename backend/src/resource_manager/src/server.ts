import express from 'express';
import { json, urlencoded } from 'body-parser';
import { getCategoryList, getResourceList, healthCheck } from './app';
import { auditRegion, reports } from './func';
import { common } from './utils';

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
app.get('/resources/reports', async (req, res) => await common(req, res, reports));

export default app;
