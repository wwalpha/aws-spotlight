// import { getResource, sendMessage } from '@test/utils/utils';
// import { cloudtrail } from '@src/index';
// import * as Events from './datas';
// import * as EXPECTS from './expects';
// import * as fs from 'fs';
// import * as path from 'path';

// describe('route53resolver.amazonaws.com', () => {
//   test('ROUTE53RESOLVER_CreateResolverEndpoint', async () => {
//     const event = await sendMessage(Events.ROUTE53RESOLVER_CreateResolverEndpoint);
//     await cloudtrail(event);

//     const resource = await getResource(
//       'arn:aws:route53resolver:ap-northeast-1:999999999999:resolver-endpoint/rslvr-in-9747e1a641b34ad39'
//     );
//     fs.writeFileSync(path.join(__dirname, './expects/DMS_CreateReplicationInstance.json'), JSON.stringify(resource));
//     expect(resource).not.toBeUndefined();
//     expect(resource).toEqual(EXPECTS.ROUTE53RESOLVER_CreateResolverEndpoint);
//   });

//   test('ROUTE53RESOLVER_DeleteResolverEndpoint', async () => {
//     const event = await sendMessage(Events.ROUTE53RESOLVER_DeleteResolverEndpoint);
//     await cloudtrail(event);

//     const resource = await getResource(
//       'arn:aws:route53resolver:ap-northeast-1:999999999999:resolver-endpoint/rslvr-in-9747e1a641b34ad39'
//     );
//     fs.writeFileSync(path.join(__dirname, './expects/DMS_CreateReplicationInstance.json'), JSON.stringify(resource));
//     expect(resource).not.toBeUndefined();
//     expect(resource).toEqual(EXPECTS.ROUTE53RESOLVER_DeleteResolverEndpoint);
//   });
// });
