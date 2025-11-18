'use client';

import { ConfirmDialog } from '@lib/client/components/ui/confirm';
import { useDeleteHelper } from '@lib/client/hooks/useDeleteHelper';
import { useOnBack } from '@lib/client/hooks/useOnBack';
import { useTranslate } from '@refinedev/core';
import React, {
  type PropsWithChildren,
  createContext,
  useCallback,
  useState,
} from 'react';

type DeleteDataType = {
  toogle: boolean;
  row: any;
  resource: string;
  redirectBack?: boolean;
  onAfterHandle?: () => void;
};

export interface DeleteContextType {
  data: DeleteDataType;
  updateData: (data: DeleteDataType) => void;
}

export function DeleteActionModal(props: DeleteContextType) {
  const back = useOnBack();
  const { can, isLoading, mutate } = useDeleteHelper(
    props.data?.resource,
    props.data?.row?.id,
  );

  const translate = useTranslate();

  const onDelete = useCallback(() => {
    if (can) {
      return mutate({
        onSuccess() {
          const isRedirectBack = props?.data?.redirectBack ?? false;
          const onAfterHandle = props?.data?.onAfterHandle;
          props?.updateData({
            toogle: false,
            row: undefined,
            resource: '',
            redirectBack: false,
            onAfterHandle: undefined,
          });

          if (isRedirectBack) {
            back?.();
          }

          if (onAfterHandle) {
            onAfterHandle();
          }
        },
      });
    }

    return undefined;
  }, [can, props]);

  return (
    <ConfirmDialog
      open={can && props?.data?.toogle}
      loading={isLoading}
      title={translate('dialogs.areYouSure', undefined, 'Are you sure?')}
      description={translate(
        'dialogs.thisActionCannotBeUndone',
        undefined,
        'This action cannot be undone.',
      )}
      okText={translate('dialogs.delete', undefined, 'Delete')}
      cancelText={translate('dialogs.cancel', undefined, 'Cancel')}
      okButtonVariant={'destructive'}
      onOpenChange={() => {
        if (!isLoading) {
          props?.updateData({
            toogle: false,
            row: undefined,
            resource: '',
          });
        }
      }}
      onConfirm={onDelete}
    />
  );
}

const DeleteContext = createContext<DeleteContextType | undefined>(undefined);

const DeleteProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<DeleteDataType>({
    row: undefined,
    resource: '',
    toogle: false,
    onAfterHandle: undefined,
  });

  const updateData = (data: DeleteDataType) => {
    setData(data);
  };

  return (
    <DeleteContext.Provider value={{ data, updateData }}>
      {children}
      <DeleteActionModal
        data={data as DeleteDataType}
        updateData={updateData}
      />
    </DeleteContext.Provider>
  );
};

export { DeleteContext, DeleteProvider };
