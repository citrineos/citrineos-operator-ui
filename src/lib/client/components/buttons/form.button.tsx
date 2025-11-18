// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { Button, type ButtonProps } from '@lib/client/components/ui/button';
import { CanAccess, useSaveButton, useTranslation } from '@refinedev/core';
import type {
  RefineButtonResourceProps,
  RefineButtonSingleProps,
  RefineSaveButtonProps,
} from '@refinedev/ui-types';
import { Check, Save, Send, Trash } from 'lucide-react';
import type { ComponentProps, FC } from 'react';
import { buttonIconSize } from '@lib/client/styles/icon';

export enum FormButtonVariants {
  confirm = 'confirm',
  delete = 'delete',
  save = 'save',
  submit = 'submit',
}

export type FormButtonProps = ButtonProps &
  RefineSaveButtonProps &
  RefineButtonResourceProps &
  RefineButtonSingleProps & {
    access?: Omit<
      ComponentProps<typeof CanAccess>,
      'children' | 'action' | 'resource' | 'params'
    >;
    submitButtonVariant?: FormButtonVariants;
    submitButtonLabel?: string;
  };

export const FormButton: FC<FormButtonProps> = ({
  hideText = false,
  children,
  accessControl,
  access,
  resource,
  recordItemId,
  ...props
}) => {
  // TODO in a separate PR, improve translation capabilities
  const { translate } = useTranslation();
  const { label } = useSaveButton();

  const translatedLabel = translate('buttons.save', 'Save');

  if (accessControl?.hideIfUnauthorized && accessControl.enabled) {
    return null;
  }

  const { submitButtonLabel, submitButtonVariant, ...buttonProps } = props;

  switch (submitButtonVariant) {
    case FormButtonVariants.confirm:
      return (
        <Button {...buttonProps} variant="success">
          <Check className={buttonIconSize} />
          {!hideText && (submitButtonLabel ?? 'Confirm')}
        </Button>
      );
    case FormButtonVariants.delete:
      return (
        <Button {...buttonProps} variant="destructive">
          <Trash className={buttonIconSize} />
          {!hideText && (submitButtonLabel ?? 'Delete')}
        </Button>
      );
    case FormButtonVariants.submit:
      return (
        <Button {...buttonProps} variant="secondary">
          <Send className={buttonIconSize} />
          {!hideText && (submitButtonLabel ?? 'Submit')}
        </Button>
      );
    default:
      return (
        <Button {...buttonProps}>
          <Save className={buttonIconSize} />
          {!hideText && (children ?? label ?? translatedLabel)}
        </Button>
      );
  }
};

FormButton.displayName = 'FormButton';
