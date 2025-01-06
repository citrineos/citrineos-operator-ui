import { Form } from 'antd';
import { HttpMethod } from '@citrineos/base';
import { plainToInstance } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty } from 'class-validator';

import { GenericForm } from '../../components/form';
import { useSelectedChargingStationIds } from '@hooks';
import { triggerMessageAndHandleResponse } from '../util';
import { MessageConfirmation } from '../MessageConfirmation';

export enum DeleteStationNetworkProfilesRequestProps {
  configurationSlots = 'configurationSlots',
}

export class DeleteStationNetworkProfilesRequest {
  @ArrayMinSize(1)
  @IsArray()
  @IsInt()
  @IsNotEmpty()
  configurationSlots!: number[];
}

export const DeleteStationNetworkProfiles: React.FC = () => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };
  const stationIds = useSelectedChargingStationIds();
  const deleteStationNetworkProfilesRequest =
    new DeleteStationNetworkProfilesRequest();

  const handleSubmit = async (plainValues: any) => {
    const classInstance = plainToInstance(
      DeleteStationNetworkProfilesRequest,
      plainValues,
    );

    let url = `/configuration/serverNetworkProfile?stationId=${stationIds}`;
    for (const configurationSlot of classInstance.configurationSlots) {
      url = url + `&configurationSlot=${configurationSlot}`;
    }

    await triggerMessageAndHandleResponse({
      url: url,
      isDataUrl: true,
      data: undefined,
      method: HttpMethod.Delete,
      responseSuccessCheck: () => true,
      responseClass: MessageConfirmation,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      onFinish={handleSubmit}
      dtoClass={DeleteStationNetworkProfilesRequest}
      initialValues={deleteStationNetworkProfilesRequest}
      parentRecord={deleteStationNetworkProfilesRequest}
    />
  );
};
