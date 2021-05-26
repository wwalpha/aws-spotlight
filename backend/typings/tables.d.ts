/**
 * Table - EventType Key
 */
export interface EventTypeKey {
  EventName: string;
  EventSource: string;
}

/**
 * Table - EventType
 */
export interface EventType extends EventTypeKey {
  Unprocessed?: boolean;
  Create?: boolean;
  Delete?: boolean;
  Ignore?: boolean;
}

/**
 * Table - Notification Key
 */
export interface NotificationKey {
  EventName: string;
  EventSource: string;
}

/**
 * Table - Notification
 */
export interface Notification extends NotificationKey {
  EventSource: string;
  UserName: string;
  AWSRegion: string;
  ResourceName: string;
  ResourceArn: string;
  Target: string;
  requestParameters: string;
  responseElements: string;
}

/**
 * Table - Resource Key
 */
export interface ResouceKey {
  EventSource: string;
  ResourceId: string;
}

/**
 * Table - Resource
 */
export interface Resource extends ResouceKey {
  ResourceName: string;
  UserName: string;
  EventId: string;
  EventName: string;
  EventTime: string;
  AWSRegion: string;
  UserAgent: string;
  IdentityType: string;
  Service: string;
}

/**
 * Table - Resource Key
 */
export interface ResouceKeyGSI1Key {
  UserName: string;
  ResourceId: string;
}

/**
 * Table - Unprocessed Key
 */
export interface UnprocessedKey {
  EventName: string;
  EventTime: string;
}

/**
 * Table - Unprocessed
 */
export interface Unprocessed extends UnprocessedKey {
  Raw: string;
}

/**
 * Table - History Key
 */
export interface HistoryKey {
  EventId: string;
}

/**
 * Table - History
 */
export interface History extends HistoryKey {
  UserName: string;
  EventTime: string;
  EventSource: string;
  EventName: string;
  AWSRegion: string;
  Origin: string;
}

/**
 * Table - Announcement Key
 */
export interface AnnouncementKey {
  Category: string;
  DateTIme: string;
}

/**
 * Table - Announcement
 */
export interface Announcement extends AnnouncementKey {
  Type: string;
  Text: string;
}

/**
 * Table - Category Key
 */
export interface CategoryKey {
  UserName: string;
  Category: string;
}

/**
 * Table - Category
 */
export interface Category extends CategoryKey {
  Text: string;
}
