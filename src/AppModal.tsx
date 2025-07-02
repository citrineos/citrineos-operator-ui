// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, selectModal } from './redux/modal.slice';
import { RemoteStartTransactionModal } from './modals/remote-start/remote.start.modal';
import React from 'react';
import { RemoteStopTransactionModal } from './modals/remote-stop/remote.stop.modal';
import { ResetModal } from './modals/reset/reset.modal';
import { OtherCommandsModal } from './modals/other-commands/other.commands.modal';
import { GetLogsModal } from './modals/2.0.1/get-logs/get.logs.modal';

export enum ModalComponentType {
  remoteStart,
  remoteStop,
  reset,
  getLogs,
  otherCommands,
  otherCommandsDynamic,
}

const MODAL_COMPONENTS: Partial<{
  [key in ModalComponentType]: React.FC<any>;
}> = {
  [ModalComponentType.remoteStart]: RemoteStartTransactionModal,
  [ModalComponentType.remoteStop]: RemoteStopTransactionModal,
  [ModalComponentType.reset]: ResetModal,
  [ModalComponentType.getLogs]: GetLogsModal,
  [ModalComponentType.otherCommands]: OtherCommandsModal,
};

const AppModal = () => {
  const dispatch = useDispatch();
  const { isOpen, title, modalComponentType, modalComponentProps } =
    useSelector(selectModal);

  const ModalComponent =
    modalComponentType != undefined
      ? MODAL_COMPONENTS[modalComponentType]
      : null;

  return (
    <Modal
      title={title}
      centered
      open={isOpen}
      onCancel={() => dispatch(closeModal())}
      footer={null}
    >
      {modalComponentType === ModalComponentType.otherCommandsDynamic
        ? modalComponentProps?.content
        : ModalComponent && <ModalComponent {...modalComponentProps} />}
    </Modal>
  );
};

export default AppModal;
