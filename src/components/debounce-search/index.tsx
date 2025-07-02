// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { Input } from 'antd';

const { Search } = Input;

const defaultDebounceInMillis = 300;
const maxInputLength = 100;

export interface DebounceSearchProps {
  onSearch: any;
  placeholder: string;
  debounceInMillis?: number;
}

export const DebounceSearch = ({
  onSearch,
  placeholder,
  debounceInMillis,
}: DebounceSearchProps) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  const onChangeDebounce = useMemo(
    () => debounce(onChange, debounceInMillis ?? defaultDebounceInMillis),
    [],
  );

  // to cancel debounce when component unmounts
  useEffect(() => {
    return () => {
      onChangeDebounce.cancel();
    };
  }, []);

  return (
    <Search
      placeholder={placeholder}
      onChange={onChangeDebounce}
      onSearch={onSearch}
      maxLength={maxInputLength}
      style={{ width: 300 }}
    />
  );
};
