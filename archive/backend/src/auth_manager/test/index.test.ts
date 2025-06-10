import { CognitoIdentityServiceProvider } from 'aws-sdk';
import axios, { AxiosStatic } from 'axios';
import request from 'supertest';
import { sign } from 'jsonwebtoken';
import * as fs from 'fs';
import server from '../src/server';
import { User, Auth, System } from 'typings';
import Releases from './expect/releases.json';

jest.mock('axios');
jest.mock('amazon-cognito-identity-js');
// jest.mock('aws-sdk');

describe('auth manager', () => {
  test('health check', async () => {
    const response = await request(server).get('/auth/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      service: 'Auth Manager',
      isAlive: true,
    });
  });

  test.skip('login', async () => {
    axios.prototype.get = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        data: {
          isExist: true,
          clientId: 'ClientID',
          userPoolId: 'UserPoolId',
          identityPoolId: 'IdentityPoolId',
        } as User.LookupUserResponse,
      })
    );

    // api.get.mockResolvedValueOnce({
    //   status: 200,
    //   data: {
    //     isExist: true,
    //     clientId: 'ClientID',
    //     userPoolId: 'UserPoolId',
    //     identityPoolId: 'IdentityPoolId',
    //   } as User.LookupUserResponse,
    // });

    const response = await request(server)
      .post('/auth')
      .send({
        username: 'test001',
        password: 'password001',
      } as Auth.SignInRequest);

    expect(response.statusCode).toBe(200);
  });

  test.skip('auth initiate', async () => {
    CognitoIdentityServiceProvider.prototype.adminInitiateAuth = jest.fn().mockImplementationOnce(() => ({
      promise: () =>
        Promise.resolve({
          AuthenticationResult: {
            AccessToken: 'Test_AccessToken',
            IdToken: 'Test_IdToken',
            RefreshToken: 'Test_RefreshToken',
          },
        }),
    }));

    const accessToken = sign(
      {
        iss: 'https://cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-AAAAAAAAAAA',
        client_id: 'aaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
      fs.readFileSync('./test/configs/private.key'),
      { algorithm: 'RS256' }
    );

    const refreshToken =
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.PUb27iMA7eVVqJi1HFr-HCSo7FTW_X77WakKHJhVZq4SQOQEOaPUKAKHNLGq7_RFWnhUXBX5E07opYJKVp_7DnqxE-rSR37oI5iRn7DyxMqkqZkBaVLLC-BUK1YD0n95_daXLohViTiiI9itW9DsWV6JMMXbJdA0LzAD4a6EKFvtPV702iMXY1nJy4xv7avaQWx6bdyyG48COtawGeJ_ymh2ecKjHxCLqkxA42EvkBN_toR7O2wIgcy-0pXwbsFFH5gCaRDBqAYNKNhAxQs4zdUvrObgiOwHwQXfvZXsRARQTWjnxPc3GZL33FJ_qV-A7JkuF71hrKtK16zS2548Tw.tJQr_C9f6lOiMK95.Y9zQPk1B8zBk--MCaEeBTCiSIvlyp2P4u6YnPZIpnzX_lnaZG0Ei2Cr-Jjzn2V7kDXqy751HeY1LkCZVafwOEIiay4fioahPP-o0b6opQXnmEILkfeh_7Yz55Y2RuEUWkEjJ-MsIecDKGQTAb-GYWsvBK-Ar0sMPwPdjYPTqHpVwOfgHCv_dbGJcNLZK6v9fSsEaWfUNJlGBhC2ReUonDBzsARTzlgNBMkVq_NOiWGddSfOi0swym4gH1Q8aEF_2JA12eHSRR0fDQAJapTQYW44_bKVFPVzvq7pJxfRoPDm5tCeDzntfx2KWjyRApCGpEMyOmsJwIGRBBux969ltwNGSChMMsAzbvXwoSRJ2QX5U3OGWGz7aiSpLkJ5SM_CAtvlEHE1G39VWRVOrmBNl-T8t8rn2E_mk-jBGgCLeGuJ7fIOgOdOfFfPoH68zLmIZFCUf8ioVZLm57fhwV3aPLDsJaik9G1jGF6lf2ab5go5qifuUKpEfm6FvMasCFRn0Sp7a5VHZoOJX2kVexW5RkRC5s_RlesuwU6NFS1Qz_aYUdpy4T0QzeC3ninUjXRf73CFTnODGwjBxq9ihQoA_1Et9hZtB2o_QyfvEN1rTjsHlx3v06YoW9aAuhuBRQsXpFyY9xghSwHzWBXYUc-2_fRcIR-3Oc2XnUeYoa9_rBWQUM-ZWfAlxGCnMlIsWkdymIa_H1_cGRvW4i85zKblqtBqHhd0bJznh_OVtxi4ywa7BWKNy0DiFJy2a0bk3X3mWy97SLao-jm5AFQAyZXBYthvlKJ6wFXVmGVFsQ3qvxwTpV4WMheKFaMxLUJ2IA6__eDKyp7KvUONOx8SgRzvhsCMTYYBmiwfUsrLcRfL8HcR-ixPV_BBWmTOGlcqWKCswr1lu-xworBfA1AsAmiRjWMMxcWMQoSFxEt3xex5pXzMb5LvoJkEZ_XZKgbw8zJ6ItUjLqXA68__m3dwbqBvDCP5we_PDg8l7tOAN8feK0Cbja6fOmVdTICzpqya6arRV1Ps4F1ghR0Fjt2uQmKL_A8z0rFnEsWOYY83S7b1fml6wZ27fXlmglMaoNgBp07t1RveNPT7GCjqFacf4aMu-cWdTQi8xark0vbD3cyoBWIsEt6U-nYyRkDI5kQYCugQvQYkfO0koZJBKPCnvP5LNBR0-7SspJ4j6Sgh2daEtt0AuozxGMaSVwmKB3JB9MoUwIPSNEyHaaGmL_d8gZW-59iQtwiun4us7QAOPZrDhYQ.8PTRDU_kFC5ODlkU000000';

    const response = await request(server)
      .post('/auth/initiate')
      .send({
        accessToken,
        refreshToken,
      } as Auth.InitiateAuthRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      accessToken: 'Test_AccessToken',
      idToken: 'Test_IdToken',
      refreshToken: 'Test_RefreshToken',
    } as Auth.InitiateAuthResponse);

    jest.clearAllMocks();
  });

  test('release', async () => {
    const response = await request(server).get('/system/releases');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(Releases);
  });

  test('version', async () => {
    const response = await request(server).get('/system/version');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      version: 'v0.2.1',
    } as System.VersionResponse);
  });
});
