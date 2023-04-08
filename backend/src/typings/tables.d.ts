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

  // /**
  //  * Table - Notification Key
  //  */
  // interface NotificationKey {
  //   EventName: string;
  //   EventSource: string;
  // }

  // /**
  //  * Table - Notification
  //  */
  // interface Notification extends NotificationKey {
  //   EventSource: string;
  //   UserName: string;
  //   AWSRegion: string;
  //   ResourceName: string;
  //   ResourceArn: string;
  //   Target: string;
  //   requestParameters: string;
  //   responseElements: string;
  // }

  /**
   * Table - Resource Key
   */
  interface TResourceKey {
    ResourceId: string;
  }

  /**
   * Table - Resource
   */
  interface TResource extends TResourceKey {
    ResourceName: string;
    UserName: string;
    EventSource: string;
    EventName: string;
    EventId: string;
    EventTime: string;
    AWSRegion: string;
    UserAgent: string;
    IdentityType: string;
    Service: string;
    Revisions?: string[];
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
    UserAgent: string;
    IdentityType: string;
    Service: string;
  }

  interface ResouceGSI2Key {
    UserName: string;
    ResourceId: string;
  }

  interface ResouceGSI2 extends ResouceGSI2Key {
    ResourceName: string;
    EventId: string;
    EventSource: string;
    EventName: string;
    EventTime: string;
    AWSRegion: string;
    UserAgent: string;
    IdentityType: string;
    Service: string;
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
    ResourceId: string;
    Raw: string;
  }

  /**
   * Table - Errors Key
   */
  interface TErrorsKey {
    EventName: string;
    EventTime: string;
  }

  /**
   * Table - TErrors
   */
  interface TErrors extends TErrorsKey {
    EventSource: string;
    Raw: string;
  }

  /**
   * Table - History Key
   */
  interface HistoryKey {
    EventId: string;
  }

  /**
   * Table - History
   */
  interface History extends HistoryKey {
    UserName: string;
    EventTime: string;
    EventSource: string;
    EventName: string;
    AWSRegion: string;
    Origin: string;
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
