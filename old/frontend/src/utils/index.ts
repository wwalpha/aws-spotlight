import * as APIInstance from './API';
import { APIClass } from 'typings';

const API = APIInstance as unknown as APIClass;

export { API };

export { default as Credentials } from './Credentials';
export * as Token from './Token';
