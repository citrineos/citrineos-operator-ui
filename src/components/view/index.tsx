import React, { useEffect, useRef, useState } from 'react';
import {
  Create,
  DeleteButton,
  Edit,
  ListButton,
  RefreshButton,
  Show,
  useForm,
  UseFormReturnType,
} from '@refinedev/antd';
import { GenericForm, GenericProps } from '../form';
import { useNavigate, useParams } from 'react-router-dom';
import { GetFields, GetVariables } from '@refinedev/hasura';
import { HttpError } from '@refinedev/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CustomAction, CustomActions } from '../custom-actions';
import { ResourceType } from '../../resource-type';
import dayjs from 'dayjs';
import { NEW_IDENTIFIER } from '../../util/consts';
import { useDispatch } from 'react-redux';
import { setSelectedChargingStation } from '../../redux/selectedChargingStationSlice';

export enum GenericViewState {
  SHOW = 'show',
  EDIT = 'edit',
  CREATE = 'create',
}

export interface GenericParameterizedViewProps extends GenericViewProps {
  state: GenericViewState;
  id?: string | number | null;
  resourceType?: ResourceType;
  hideListButton?: boolean;
  useFormProps?: UseFormReturnType<any>;
}

export interface GenericViewProps extends GenericProps {
  gqlQuery: any;
  editMutation?: any;
  createMutation?: any;
  deleteMutation?: any;
  customActions?: CustomAction<any>[];
}

export const GenericView = (props: GenericViewProps) => {
  const {
    dtoClass,
    gqlQuery,
    editMutation,
    createMutation,
    deleteMutation,
    customActions,
    overrides,
  } = props as GenericViewProps;
  const params: any = useParams<{ id: string }>();
  const id = params.id;
  let genericViewState: GenericViewState;
  if (id === NEW_IDENTIFIER) {
    genericViewState = GenericViewState.CREATE;
  } else if (params['*'] === 'edit') {
    genericViewState = GenericViewState.EDIT;
  } else {
    genericViewState = GenericViewState.SHOW;
  }
  return (
    <GenericParameterizedView
      id={id}
      state={genericViewState}
      dtoClass={dtoClass}
      overrides={overrides}
      gqlQuery={gqlQuery}
      editMutation={editMutation}
      createMutation={createMutation}
      deleteMutation={deleteMutation}
      customActions={customActions}
      hideListButton={false}
    />
  );
};

export const GenericParameterizedView = (
  props: GenericParameterizedViewProps,
) => {
  const {
    state,
    id,
    resourceType,
    dtoClass,
    overrides,
    gqlQuery,
    editMutation,
    createMutation,
    deleteMutation,
    customActions,
    hideListButton = true,
    useFormProps,
  } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef();
  const gqlMutation =
    state === GenericViewState.CREATE ? createMutation : editMutation;
  const gqlDeleteMutation = deleteMutation;
  const obj = {
    id,
    queryOptions: {
      enabled: state !== GenericViewState.CREATE,
    },
    meta: {
      gqlQuery,
      gqlMutation,
    },
  } as any;
  if (resourceType) {
    obj.resource = resourceType;
  }
  const [parentRecord, setParentRecord] = useState<any>(
    plainToInstance(dtoClass, {}),
  );

  const {
    formProps: defaultFormProps,
    saveButtonProps: defaultSaveButtonProps,
    queryResult: defaultQueryResult,
    formLoading: defaultFormLoading,
    form: defaultForm,
  } = useForm<GetFields<any>, HttpError, GetVariables<any>>(obj);

  const formProps = useFormProps ? useFormProps.formProps : defaultFormProps;
  const _saveButtonProps = useFormProps
    ? useFormProps.saveButtonProps
    : defaultSaveButtonProps;
  const queryResult = useFormProps
    ? useFormProps.queryResult
    : defaultQueryResult;
  const formLoading = useFormProps
    ? useFormProps.formLoading
    : defaultFormLoading;
  const _form = useFormProps ? useFormProps.form : defaultForm;

  let WrapperComponent;
  switch (state) {
    case GenericViewState.CREATE:
      WrapperComponent = Create;
      break;
    case GenericViewState.SHOW:
      WrapperComponent = Show;
      break;
    case GenericViewState.EDIT:
    default:
      WrapperComponent = Edit;
  }

  const setFieldsValues = () => {
    if (formRef.current && queryResult?.data?.data) {
      const instance = plainToInstance(dtoClass, queryResult.data.data, {
        excludeExtraneousValues: false,
      });
      setParentRecord(instance);

      // Set the selectedChargingStationSlice
      dispatch(
        setSelectedChargingStation({
          selectedChargingStation: JSON.stringify(instanceToPlain(instance)),
        }),
      );
      (formRef.current as any).setFieldsValues(instance as any);
    }
  };

  const getValuesFromInput = (input: any) => {
    for (const property of Object.keys(input)) {
      if (input[property] && input[property].$isDayjsObject) {
        input[property] = dayjs(input[property]).toISOString();
      }
    }
    return instanceToPlain(plainToInstance(dtoClass, input));
  };

  useEffect(() => {
    setFieldsValues();
  }, [queryResult?.data?.data]);

  const onFinish = (input: any) => {
    const values = getValuesFromInput(input);
    formProps.onFinish?.({
      ...values,
      ...(state === GenericViewState.CREATE
        ? { createdAt: new Date().toISOString() }
        : {}),
      updatedAt: new Date().toISOString(),
    } as any);
  };

  return (
    <WrapperComponent
      title={resourceType}
      isLoading={formLoading}
      canDelete={false} // disable generated delete does not work
      headerProps={{
        extra: (
          <>
            {customActions && customActions.length > 0 && (
              <CustomActions
                actions={customActions}
                data={queryResult?.data?.data}
              />
            )}
            {!hideListButton && <ListButton resource={resourceType} />}
            {state !== GenericViewState.CREATE && (
              <RefreshButton onClick={() => queryResult?.refetch()} />
            )}
            <DeleteButton
              meta={{
                gqlMutation: gqlDeleteMutation,
              }}
              onSuccess={() => {
                navigate('../');
              }}
              recordItemId={id as any}
            />
          </>
        ),
      }}
      saveButtonProps={{ style: { display: 'none' } }}
    >
      <GenericForm
        ref={formRef as any}
        formProps={formProps}
        dtoClass={dtoClass}
        parentRecord={parentRecord}
        overrides={overrides}
        onFinish={onFinish}
        disabled={state === GenericViewState.SHOW}
      />
    </WrapperComponent>
  );
};
