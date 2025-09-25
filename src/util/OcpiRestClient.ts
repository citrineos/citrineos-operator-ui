// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { BaseRestClient } from './BaseRestClient';
import config from './config';

const CITRINE_OCPI_URL = config.citrineOcpiUrl;

export class OcpiRestClient extends BaseRestClient {
  constructor() {
    super(null);
    this.baseUrl = `${CITRINE_OCPI_URL}/ocpi/admin/v2.2.1/`;
  }
}
