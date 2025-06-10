import app from './server';
import { Logger } from './utils';

const PORT = process.env.PORT || 8080;

// Start the servers
app.listen(PORT, () => {
  Logger.info('Resource manager service started on port 8080');
});

export default app;
