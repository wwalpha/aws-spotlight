import { start as releases } from '../src/initialize';
// import { SETTINGS_ID_RELEASE } from '../src/consts';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Tables } from 'typings';

const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });
const TABLE_NAME_SETTINGS = process.env.TABLE_NAME_SETTINGS as string;

// describe.skip('release events', () => {
//   test('release notes', async () => {
//     await releases();

//     const result = await helper.get<Tables.Settings.Releases>({
//       TableName: TABLE_NAME_SETTINGS,
//       Key: {
//         Id: SETTINGS_ID_RELEASE,
//       },
//     });

//     expect(result).not.toBeUndefined;
//     expect(result?.Item).not.toBeUndefined;
//     expect(result?.Item?.Id).toEqual('RELEASE');
//   });
// });
