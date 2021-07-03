import { CloudTrail, Tables } from 'typings';

export const STATES_DeleteStateMachine = (record: CloudTrail.Record): Tables.ResouceGSI1Key => ({
  EventSource: record.eventSource,
  ResourceId: record.requestParameters.stateMachineArn,
});
