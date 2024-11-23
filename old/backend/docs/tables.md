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
| Username          |       |      |      |      |      |
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
| EventSource  | HASH  |      |      | RANGE |      |
| ResourceId   | RANGE |      |      |       |      |
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
| Query  | GSI1  | UserName = :UserName AND EventSource = :EventSource     |
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

## Announcement

| Item     | Key   | LSI1 | LSI2 | GSI1 | GSI2 |
| -------- | ----- | ---- | ---- | ---- | ---- |
| Category | HASH  |      |      |      |      |
| DateTIme | RANGE |      |      |      |      |
| Type     |       |      |      |      |      |
| Text     |       |      |      |      |      |

#### Search Conditions

| Method | Conditions                                    |
| ------ | --------------------------------------------- |
| Query  | Category = :Category AND DateTIme = :DateTIme |

#### Search Example

```
1. Category = 'RELEASE' SORT DateTime DESC
2. Category = 'Notice'
```

## Category

| Item     | Key   | LSI1 | LSI2 | GSI1 | GSI2 |
| -------- | ----- | ---- | ---- | ---- | ---- |
| UserName | HASH  |      |      |      |      |
| Category | RANGE |      |      |      |      |
| Text     |       |      |      |      |      |

#### Search Conditions

| Method | Conditions           |
| ------ | -------------------- |
| Query  | UserName = :UserName |
| Scan   |                      |
