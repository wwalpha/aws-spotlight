export * from './cloudtrail';
export * from './resource';
export * from './users';
export * from './token';
export * from './tables';
export * from './auth';
export * from './system';

import { Tables } from './tables';

export type EVENT_TYPE = Record<string, Tables.EventType>;
