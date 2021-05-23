import express from 'express';
import { json, urlencoded } from 'body-parser';
import winston from 'winston';
import { getResourceList, healthCheck } from './app';

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
app.get('/resources/:resourceId', getResourceList);

// Start the servers
app.listen(8080, () => console.log('Resource manager service started on port 8080'));

export default app;
