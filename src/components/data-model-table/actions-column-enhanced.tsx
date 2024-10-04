import { Alert, Button, Col, Row } from 'antd';
import { CustomAction, CustomActions } from '../custom-actions';
import React, { MouseEventHandler } from 'react';
import { CloseOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { EditButton, ShowButton } from '@refinedev/antd';
import { AnimatePresence, motion } from 'framer-motion';
import { DeleteButton } from '../custom-actions/delete';
import { CLASS_RESOURCE_TYPE } from '../../util/decorators/ClassResourceType';
import { PRIMARY_KEY_FIELD_NAME } from '../../util/decorators/PrimaryKeyFieldName';
import { plainToInstance } from 'class-transformer';
import { CLASS_GQL_DELETE_MUTATION } from '../../util/decorators/ClassGqlDeleteMutation';

export enum ColumnAction {
  DELETE = 'DELETE',
  EDIT = 'EDIT',
  SHOW = 'SHOW',
  SAVE = 'SAVE',
  CANCEL = 'CANCEL',
}

export interface IActionsColumnEnhancedProps {
  record: any;
  dtoClass: any; // todo type
  actions: ColumnAction[];
  customActions?: CustomAction<any>[];
  onEdit?: (record: any) => void;
  onCancel?: MouseEventHandler<any>; // todo type
  onSave?: (record: any) => void; // todo type
  onDeleteSuccess?: () => void;
}

export interface CancelButtonProps<T> {
  onCancel?: MouseEventHandler<any>;
}

export const CancelButton = <T,>({ onCancel }: CancelButtonProps<T>) => {
  return (
    <AnimatePresence>
      {onCancel && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '25px' }}
          exit={{ opacity: 0, width: 0 }}
        >
          <Button
            icon={<CloseOutlined />}
            onClick={onCancel}
            className="cancel-button"
            size="small"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ActionsColumnEnhanced = ({
  record,
  dtoClass,
  actions = [ColumnAction.SHOW, ColumnAction.EDIT, ColumnAction.DELETE],
  customActions,
  onEdit,
  onSave,
  onCancel,
  onDeleteSuccess,
}: IActionsColumnEnhancedProps) => {
  const dtoClassInstance = plainToInstance(dtoClass, {});

  const dtoResourceType = Reflect.getMetadata(
    CLASS_RESOURCE_TYPE,
    dtoClassInstance as Object,
  );
  if (!dtoResourceType) {
    return (
      <Alert
        message="Error: ActionsColumnEnhanced cannot find ResourceType for dtoClass"
        type="error"
      />
    );
  }
  const primaryKeyFieldName = Reflect.getMetadata(
    PRIMARY_KEY_FIELD_NAME,
    dtoClassInstance as Object,
  );
  if (!primaryKeyFieldName) {
    return (
      <Alert
        message="Error: ActionsColumnEnhanced cannot find primaryKeyFieldName for dtoClass"
        type="error"
      />
    );
  }

  const dtoGqlDeleteMutation = Reflect.getMetadata(
    CLASS_GQL_DELETE_MUTATION,
    dtoClassInstance as Object,
  );
  if (!dtoGqlDeleteMutation) {
    return (
      <Alert
        message="Error: GenericDataTable cannot find GqlDeleteMutation for dtoClass"
        type="error"
      />
    );
  }

  return (
    <Row gutter={4} align="middle" wrap={false}>
      {actions && actions.includes(ColumnAction.SHOW) && (
        <Col>
          <ShowButton
            hideText
            key={`${record?.[primaryKeyFieldName]}-show-button`}
            size="small"
            recordItemId={record?.[primaryKeyFieldName]}
          />
        </Col>
      )}
      {actions && actions.includes(ColumnAction.EDIT) && (
        <Col>
          <EditButton
            hideText
            icon={<EditOutlined />}
            key={`${record?.[primaryKeyFieldName]}-edit-button`}
            size="small"
            recordItemId={onEdit ? undefined : record?.[primaryKeyFieldName]}
            onClick={onEdit ? () => onEdit(record) : undefined}
          />
        </Col>
      )}
      {actions && actions.includes(ColumnAction.SAVE) && (
        <Col>
          <Button
            icon={<SaveOutlined />}
            key={`${record?.[primaryKeyFieldName]}-save-button`}
            size="small"
            onClick={onSave ? () => onSave(record) : undefined}
          />
        </Col>
      )}
      {actions && actions.includes(ColumnAction.CANCEL) && (
        <Col>
          <CancelButton onCancel={onCancel} />
        </Col>
      )}
      {actions && actions.includes(ColumnAction.DELETE) && (
        <Col>
          <DeleteButton
            recordItemId={record[primaryKeyFieldName]}
            resource={dtoResourceType}
            gqlMutation={dtoGqlDeleteMutation}
            onDeleteSuccess={() => {
              if (onDeleteSuccess) {
                onDeleteSuccess();
              }
            }}
            onDeleteError={(error) => {
              console.error('Deletion error:', error);
            }}
          />
        </Col>
      )}
      <Col>
        {customActions && customActions.length > 0 && (
          <CustomActions actions={customActions} data={record} />
        )}
      </Col>
    </Row>
  );
};
