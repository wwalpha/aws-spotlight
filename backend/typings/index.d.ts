export * from './cloudtrail';

import * as Tables from './tables';

export { Tables };

export type EVENT_TYPE = Record<string, Tables.EventType>;
