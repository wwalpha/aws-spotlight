export * from './cloudtrail';

import * as Tables from './tables';
import * as Resource from './resource';
export * from './users';
export * from './token';

export { Tables, Token, Resource };

export type EVENT_TYPE = Record<string, Tables.EventType>;
