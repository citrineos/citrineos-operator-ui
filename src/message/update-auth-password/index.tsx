import { plainToInstance, Type } from 'class-transformer';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { IsNotEmpty } from 'class-validator';
import { GenericForm } from '../../components/form';
import { Form } from 'antd';
import { Constructable } from '../../util/Constructable';
import { BaseRestClient } from '../../util/BaseRestClient';
import { showError, showSucces } from '../util';
import { MessageConfirmation } from '../MessageConfirmation';

export interface UpdateAuthPasswordProps {
    station: ChargingStation;
}

enum UpdateAuthPasswordRequestProps {
    password = "password",
    setOnCharger = "setOnCharger",
    stationId = "stationId"
}

export class UpdateAuthPasswordRequest {
    @IsNotEmpty()
    password!: string | null;

    @IsNotEmpty()
    setOnCharger!: boolean | null;
}

// TODO: Remove this function and use the updated triggerMessageAndHandleResponse function.
export const triggerMessageAndHandleResponseWithDataURL = async <T,>(
    url: string,
    responseClass: Constructable<T>,
    data: any,
    responseSuccessCheck: (response: T) => boolean,
) => {
    try {
        const client = new BaseRestClient();
        client.setDataBaseUrl();
        const response = await client.post(url, responseClass, {}, data);

        if (responseSuccessCheck(response)) {
            showSucces();
        } else {
            let msg = 'The request did not receive a successful response.';
            if ((response as any).payload) {
                msg += `Response payload: ${(response as any).payload}`;
            }
            showError(msg);
        }
    } catch (error: any) {
        showError('The request failed with message: ' + error.message);
    }
};

export const UpdateAuthPassword: React.FC<UpdateAuthPasswordProps> = ({
    station,
}) => {
    const [form] = Form.useForm();
    const formProps = {
        form,
    };

    const updateAuthPasswordRequest = new UpdateAuthPasswordRequest();

    const handleSubmit = async (plainValues: any) => {
        const classInstance = plainToInstance(UpdateAuthPasswordRequest, plainValues);

        let data: any;

        if (classInstance &&
            classInstance[UpdateAuthPasswordRequestProps.password] &&
            classInstance[UpdateAuthPasswordRequestProps.setOnCharger]) {
            data = {
                password: classInstance[
                    UpdateAuthPasswordRequestProps.password
                ],
                setOnCharger: classInstance[
                    UpdateAuthPasswordRequestProps.setOnCharger
                ],
                stationId: station.id
            }
        }
        await triggerMessageAndHandleResponseWithDataURL(
            `/configuration/password`,
            MessageConfirmation,
            data,
            (response: MessageConfirmation) => response && response.success,
        );
    }

    return (
        <GenericForm
            formProps={formProps}
            dtoClass={UpdateAuthPasswordRequest}
            onFinish={handleSubmit}
            initialValues={updateAuthPasswordRequest}
            parentRecord={updateAuthPasswordRequest}
            gqlQueryVariablesMap={{}}
        />
    );;
};