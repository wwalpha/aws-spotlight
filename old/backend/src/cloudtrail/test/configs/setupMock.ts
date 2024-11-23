import winston, { format } from 'winston';
import * as path from 'path';

const logger = winston.createLogger({
  level: 'debug',
  format: format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, '../../debug.log') }),
    new winston.transports.File({ filename: path.join(__dirname, '../../error.log'), level: 'error' }),
  ],
});

winston.createLogger = jest.fn().mockImplementation(() => logger);
