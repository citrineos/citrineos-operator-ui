import { plainToInstance } from 'class-transformer';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty } from 'class-validator';
import { GenericForm } from '../../components/form';
import { Form } from 'antd';
import { triggerMessageAndHandleResponse } from '../util';
import { MessageConfirmation } from '../MessageConfirmation';
import { HttpMethod } from '@citrineos/base';

export interface DeleteStationNetworkProfilesProps {
  station: ChargingStation;
}

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

export const DeleteStationNetworkProfiles: React.FC<
  DeleteStationNetworkProfilesProps
> = ({ station }) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const deleteStationNetworkProfilesRequest =
    new DeleteStationNetworkProfilesRequest();

  const handleSubmit = async (plainValues: any) => {
    const classInstance = plainToInstance(
      DeleteStationNetworkProfilesRequest,
      plainValues,
    );

    let url = `/configuration/serverNetworkProfile?stationId=${station.id}`;
    for (const configurationSlot of classInstance.configurationSlots) {
      url = url + `&configurationSlot=${configurationSlot}`;
    }

    await triggerMessageAndHandleResponse({
      url: url,
      responseClass: MessageConfirmation,
      isDataUrl: true,
      data: undefined,
      responseSuccessCheck: () => true,
      method: HttpMethod.Delete,
    });
  };

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={DeleteStationNetworkProfilesRequest}
      onFinish={handleSubmit}
      initialValues={deleteStationNetworkProfilesRequest}
      parentRecord={deleteStationNetworkProfilesRequest}
    />
  );
};
