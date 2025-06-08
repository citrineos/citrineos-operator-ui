// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { ModalComponentType } from '../AppModal';

export const ModalStateName = 'modal';

interface ModalState {
  isOpen: boolean;
  title: string;
  modalComponentType: ModalComponentType | null;
  modalComponentProps?: any;
}

const initialState: ModalState = {
  isOpen: false,
  title: '',
  modalComponentType: null,
  modalComponentProps: {},
};

const modalSlice = createSlice({
  name: ModalStateName,
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{
        title: string;
        modalComponentType: ModalComponentType;
        modalComponentProps?: any;
      }>,
    ) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.modalComponentType = action.payload.modalComponentType;
      state.modalComponentProps = action.payload.modalComponentProps || {};
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.title = '';
      state.modalComponentType = null;
      state.modalComponentProps = {};
    },
  },
});

export const selectIsModalOpen = createSelector(
  (state: RootState) => state[ModalStateName],
  (modal) => modal.isOpen,
);

export const selectModal = (state: RootState) => state.modal;

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
