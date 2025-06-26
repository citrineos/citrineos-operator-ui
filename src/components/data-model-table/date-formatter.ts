// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export const DATE_FORMATTER = (dateString: string) => {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  return date.toLocaleString();
};
