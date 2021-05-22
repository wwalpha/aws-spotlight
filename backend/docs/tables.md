# DynamoDB Tables

## EventType

| Item        | Key   | LSI1 | LSI2 | GSI1 | GSI2 |
| ----------- | ----- | ---- | ---- | ---- | ---- |
| EventName   | Hash  |      |      |      |      |
| EventSource | Range |      |      |      |      |
| Unprocessed |       |      |      |      |      |
| Create      |       |      |      |      |      |
| Delete      |       |      |      |      |      |
| Ignore      |       |      |      |      |      |

#### Search Conditions

| Method | Conditions |
| ------ | ---------- |
| Scan   |            |

## Notification

#### Definition

| Item              | Key   | LSI1 | LSI2 | GSI1 | GSI2 |
| ----------------- | ----- | ---- | ---- | ---- | ---- |
| EventName         | Hash  |      |      |      |      |
| EventTime         | Range |      |      |      |      |
| EventSource       |       |      |      |      |      |
| UserName          |       |      |      |      |      |
| AWSRegion         |       |      |      |      |      |
| ResourceArn       |       |      |      |      |      |
| ResourceName      |       |      |      |      |      |
| Target            |       |      |      |      |      |
| RequestParameters |       |      |      |      |      |
| ResponseElements  |       |      |      |      |      |

#### Search Conditions

| Method | Conditions     |
| ------ | -------------- |
| Scan   | Target = Admin |
| Scan   | Target = User  |

## Resources

| Item         | Key   | LSI1 | LSI2 | GSI1  | GSI2 |
| ------------ | ----- | ---- | ---- | ----- | ---- |
| EventSource  | HASH  |      |      |       |      |
| ResourceId   | RANGE |      |      | RANGE |      |
| ResourceName |       |      |      |       |      |
| UserName     |       |      |      | HASH  |      |
| EventId      |       |      |      |       |      |
| EventName    |       |      |      |       |      |
| EventTime    |       |      |      |       |      |
| AWSRegion    |       |      |      |       |      |
| UserAgent    |       |      |      |       |      |
| IdentityType |       |      |      |       |      |

| Method | Index | Conditions                                              |
| ------ | ----- | ------------------------------------------------------- |
| Get    |       | EventSource = :EventSource AND ResourceId = :ResourceId |
| Delete |       | EventSource = :EventSource AND ResourceId = :ResourceId |
| Query  | GSI1  | UserName = :UserName                                    |
| Query  |       | EventSource = :EventSource                              |

## Unprocessed

| Item      | Key   | LSI1 | LSI2 | GSI1 | GSI2 |
| --------- | ----- | ---- | ---- | ---- | ---- |
| EventName | Hash  |      |      |      |      |
| EventTime | Range |      |      |      |      |
| Raw       |       |      |      |      |      |

#### Search Conditions

| Method | Conditions     |
| ------ | -------------- |
| Query  | EventName = ?? |

## History

| Item        | Key  | LSI1 | LSI2 | GSI1 | GSI2 |
| ----------- | ---- | ---- | ---- | ---- | ---- |
| EventId     | HASH |      |      |      |      |
| UserName    |      |      |      |      |      |
| EventTime   |      |      |      |      |      |
| EventSource |      |      |      |      |      |
| EventName   |      |      |      |      |      |
| AWSRegion   |      |      |      |      |      |
| Origin      |      |      |      |      |      |
