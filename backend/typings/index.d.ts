export * from './cloudtrail';

import * as Tables from './tables';
import * as Token from './token';
import * as Resource from './resource';

export { Tables, Token, Resource };

export type EVENT_TYPE = Record<string, Tables.EventType>;
