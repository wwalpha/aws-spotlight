export namespace Tables {
  /**
   * Table - EventType Key
   */
  interface EventTypeKey {
    EventName: string;
    EventSource: string;
  }

  /**
   * Table - EventType
   */
  interface EventType extends EventTypeKey {
    Unprocessed?: boolean;
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
  interface ResourceKey {
    EventSource: string;
    ResourceId: string;
  }

  /**
   * Table - Resource
   */
  interface Resource extends ResourceKey {
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
  interface ResouceKeyGSI1Key {
    UserName: string;
    ResourceId: string;
  }

  /**
   * Table - Unprocessed Key
   */
  interface UnprocessedKey {
    EventName: string;
    EventTime: string;
  }

  /**
   * Table - Unprocessed
   */
  interface Unprocessed extends UnprocessedKey {
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
  }
}
