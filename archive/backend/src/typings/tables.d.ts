export namespace Tables {
  /**
   * Table - EventType Key
   */
  interface TEventTypeKey {
    EventName: string;
    EventSource: string;
  }

  /**
   * Table - EventType
   */
  interface TEventType extends TEventTypeKey {
    Create?: boolean;
    Delete?: boolean;
    Ignore?: boolean;
    Unconfirmed?: boolean;
  }

  /**
   * Table - Events Key
   */
  interface TEventsKey {
    EventId: string;
  }

  /**
   * Table - Events
   */
  interface TEvents extends TEventsKey {
    UserName: string;
    EventTime: string;
    EventSource: string;
    EventName: string;
    AWSRegion: string;
    AccountId: string;
    RequestParameters: string;
    ResponseElements?: string;
  }

  /**
   * Table - Raw Key
   */
  interface TRawKey {
    EventId: string;
  }

  /**
   * Table - Raw
   */
  interface TRaw extends TRawKey {
    UserName: string;
    EventTime: string;
    EventSource: string;
    EventName: string;
    AWSRegion: string;
    AccountId: string;
    RequestParameters: string;
    ResponseElements?: string;
    Origin: string;
  }

  /**
   * Table - Resource Key
   */
  interface TResourceKey {
    ResourceId: string;
    EventTime: string;
  }

  /**
   * Table - Resource
   */
  interface TResource extends TResourceKey {
    ResourceName?: string;
    UserName: string;
    EventSource: string;
    EventName: string;
    EventId: string;
    AWSRegion: string;
    Service: string;
    Status?: string;
  }

  interface ResouceGSI1Key {
    EventSource: string;
    ResourceId: string;
  }

  interface ResouceGSI1 extends ResouceGSI1Key {
    UserName: string;
    ResourceName: string;
    EventId: string;
    EventName: string;
    EventTime: string;
    AWSRegion: string;
    Service: string;
  }

  /**
   * Table - History Key
   */
  interface THistoryKey {
    ResourceId: string;
    EventTime: string;
  }

  /**
   * Table - History
   */
  interface THistory extends THistoryKey {
    ResourceName?: string;
    UserName: string;
    EventSource: string;
    EventName: string;
    EventId: string;
    AWSRegion: string;
    Service: string;
    Status?: string;
  }

  /**
   * Table - Unprocessed Key
   */
  interface TUnprocessedKey {
    EventName: string;
    EventTime: string;
  }

  /**
   * Table - Unprocessed
   */
  interface TUnprocessed extends TUnprocessedKey {
    EventSource: string;
    EventId: string;
    ResourceId: string | string[];
    Raw: string;
  }

  interface UserKey {
    // id
    UserId: string;
  }

  interface UserItem extends UserKey {
    // first name
    UserName: string;
    // email
    Email: string;
    // role
    Role: string;
    // sub
    Sub?: string;
  }

  namespace Settings {
    interface Key {
      Id: string;
    }

    interface ReportFilter extends Key {
      Services: Record<string, string[]>;
    }

    interface Cognito extends Key {
      UserPoolId: string;
      ClientId: string;
      IdentityPoolId: string;
    }

    interface ReleaseNotes {
      type: string;
      text: string;
    }

    interface Release {
      version: string;
      date: string;
      texts: ReleaseNotes[];
    }

    interface Releases extends Key {
      Texts: Release[];
    }

    interface APIKey extends Key {
      Keys: string[];
    }

    interface GlobalServices extends Key {
      Services: string[];
    }
  }
}
