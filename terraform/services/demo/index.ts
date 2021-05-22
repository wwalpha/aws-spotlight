import AWSXRay from 'aws-xray-sdk';
import express from 'express';
import morgan from 'morgan';

const app = express();
const XRayExpress = AWSXRay.express;

app.use(XRayExpress.openSegment('backend'));
app.use(morgan('combined'));

// health check
app.get('/', (_, res) => res.send('Hello world'));
// public service
app.get('/api/local', (_, res) => res.send('Hello world2'));

app.use(XRayExpress.closeSegment());

app.listen(process.env.EXPOSE_PORT || 8080, () => {
  console.log('Started...');
  console.log('Port: ', process.env.EXPOSE_PORT || 8080);
});
