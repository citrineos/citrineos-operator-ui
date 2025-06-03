// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { DeleteButton, EditButton, ShowButton } from '@refinedev/antd';
import { Space } from 'antd';
import { CustomActions } from '../custom-actions';
import React from 'react';
import { ColumnAction } from '@enums';
import { ColumnActionProps, IActionsColumnProps } from '@interfaces';

export const ColumnActionDefaultElements = {
  [ColumnAction.DELETE]: ({ record, idField, gqlDeleteMutation }: any) => (
    <DeleteButton
      hideText
      key={`${record?.[idField]}-delete-button`}
      size="small"
      recordItemId={record?.[idField]}
      meta={{
        gqlMutation: gqlDeleteMutation,
      }}
    />
  ),
  [ColumnAction.EDIT]: ({ record, idField }: any) => (
    <EditButton
      hideText
      key={`${record?.[idField]}-edit-button`}
      size="small"
      recordItemId={record?.[idField]}
    />
  ),
  [ColumnAction.SHOW]: ({ record, idField }: any) => (
    <ShowButton
      hideText
      key={`${record?.[idField]}-show-button`}
      size="small"
      recordItemId={record?.[idField]}
    />
  ),
};

const DEFAULT_ACTIONS: ColumnActionProps[] = [
  { type: ColumnAction.EDIT },
  { type: ColumnAction.SHOW },
  { type: ColumnAction.DELETE },
];

export const ActionsColumn = ({
  record,
  idField = 'id',
  gqlDeleteMutation,
  actions,
  customActions,
}: IActionsColumnProps) => {
  const actionElements = [];

  for (const action of actions ?? DEFAULT_ACTIONS) {
    if (action.override) {
      continue;
    }

    const defaultElement = (ColumnActionDefaultElements as any)[action.type];

    if (!defaultElement) {
      continue;
    }

    actionElements.push(defaultElement({ record, idField, gqlDeleteMutation }));
  }

  return (
    <Space>
      <>
        {actionElements}
        {customActions && customActions.length > 0 && (
          <CustomActions actions={customActions} data={record} />
        )}
      </>
    </Space>
  );
};
