// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { validateSync } from 'class-validator';
import type { ClassConstructor } from 'class-transformer';
import { plainToInstance } from 'class-transformer';
import { useCallback } from 'react';

function useRequestValidator<T extends object>(
  RequestClass: ClassConstructor<T>,
  setIsFormValid: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const validateRequest = useCallback((request: T) => {
    return validateSync(request).length === 0;
  }, []);

  const onValuesChange = useCallback(
    (_changedValues: any, allValues: any) => {
      const request = plainToInstance(RequestClass, allValues, {
        excludeExtraneousValues: false,
      });

      setIsFormValid(validateRequest(request));
    },
    [validateRequest],
  );

  return { validateRequest, onValuesChange };
}

export { useRequestValidator };
