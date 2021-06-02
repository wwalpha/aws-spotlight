export * from './cloudtrail';

import * as Resource from './resource';
export * from './users';
export * from './token';
export * from './tables';

export { Resource };

export type EVENT_TYPE = Record<string, Tables.EventType>;
