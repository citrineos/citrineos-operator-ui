// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

// Flat Authorization DTO matching new backend model
export interface AuthorizationDto {
  id: string;
  idToken: string;
  idTokenType: string;
  status: string;
  expiryDateTime?: string;
  parentIdToken?: string;
  groupAuthorizationId?: string;
  additionalInfo?: Record<string, any>;
}
