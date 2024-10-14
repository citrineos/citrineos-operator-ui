import React, {useRef, useState} from 'react';
import {Form, notification, Spin} from 'antd';
import {BaseRestClient} from '../../util/BaseRestClient';
import {MessageConfirmation} from '../MessageConfirmation';
import {plainToInstance} from 'class-transformer';
import {validateSync} from 'class-validator';
import {GenericForm} from '../../components/form';
import {RequestStartTransactionRequest, RequestStartTransactionRequestProps,} from './model';
import {ChargingStation} from '../../pages/charging-stations/ChargingStation';
import {Evse, EvseProps} from '../../pages/evses/Evse';
import {NEW_IDENTIFIER} from '../../util/consts';
import {IdToken, IdTokenProps} from '../../pages/id-tokens/IdToken';
import {generateRandomSignedInt} from '../util';

export interface RemoteStartProps {
  station: ChargingStation;
}

export const RemoteStart: React.FC<RemoteStartProps> = ({ station }) => {
  const formRef = useRef();
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(false);

  const isRequestValid = (request: RequestStartTransactionRequest) => {
    const errors = validateSync(request);
    return errors.length === 0;
  };

  const onValuesChange = (changedValues: any, allValues: any) => {
    const request = plainToInstance(RequestStartTransactionRequest, allValues, {
      excludeExtraneousValues: false,
    });
    setValid((_) => isRequestValid(request));
  };

  const onFinish = (values: object) => {
    const request = plainToInstance(RequestStartTransactionRequest, values, {
      excludeExtraneousValues: false,
    });
    if (isRequestValid(request)) {
      (request as any).evseId =
        request[RequestStartTransactionRequestProps.evse][EvseProps.id];
      delete request[RequestStartTransactionRequestProps.evse];
      request[RequestStartTransactionRequestProps.idToken] = {
        idToken:
          request[RequestStartTransactionRequestProps.idToken][
            IdTokenProps.idToken
          ],
        type: request[RequestStartTransactionRequestProps.idToken][
          IdTokenProps.type
        ],
      } as any;
      requestStartTransaction(request).then();
    }
  };

  const requestStartTransaction = async (
    request: RequestStartTransactionRequest,
  ) => {
    try {
      setLoading(true);
      const client = new BaseRestClient();
      const response = await client.post(
        `/evdriver/requestStartTransaction?identifier=${station.id}&tenantId=1`,
        MessageConfirmation,
        {},
        request,
      );

      if (response && response.success) {
        notification.success({
          message: 'Success',
          description: 'The start transaction request was successful.',
        });
      } else {
        notification.error({
          message: 'Request Failed',
          description:
            'The start transaction request did not receive a successful response.',
        });
      }
    } catch (error: any) {
      const msg = `Could not perform request start transaction, got error: ${error.message}`;
      console.error(msg, error);
      notification.error({
        message: 'Error',
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin />;

  const requestStartTransactionRequest = new RequestStartTransactionRequest();
  requestStartTransactionRequest[
    RequestStartTransactionRequestProps.remoteStartId
  ] = generateRandomSignedInt();
  const evse = new Evse();
  const idToken = new IdToken();
  evse[EvseProps.databaseId] = NEW_IDENTIFIER as any;
  idToken[IdTokenProps.id] = NEW_IDENTIFIER as any;
  requestStartTransactionRequest[RequestStartTransactionRequestProps.evse] =
    evse;
  requestStartTransactionRequest[RequestStartTransactionRequestProps.idToken] =
    idToken;

  return (
    <GenericForm
      ref={formRef as any}
      dtoClass={RequestStartTransactionRequest}
      formProps={formProps}
      onFinish={onFinish}
      initialValues={requestStartTransactionRequest}
      parentRecord={requestStartTransactionRequest}
      onValuesChange={onValuesChange}
      submitDisabled={!valid}
      gqlQueryVariablesMap={{
        [RequestStartTransactionRequestProps.evse]: {
          stationId: station.id,
        },
      }}
    />
  );
};
