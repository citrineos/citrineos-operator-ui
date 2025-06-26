// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Modal, Button } from 'antd';
import { BaseRestClient } from './BaseRestClient';
import { SystemConfig } from '@citrineos/base';

let systemConfig: SystemConfig | null = null;
const client = new BaseRestClient(null);

interface TelemetryConsentModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Handle user decision; receives `true` if user accepts, `false` if user rejects */
  onDecision: (agreed: boolean) => void;
}

export async function checkTelemetryConsent(): Promise<boolean | undefined> {
  try {
    const systemConfigRaw = await client.getRaw(`/ocpprouter/systemConfig`);
    systemConfig = systemConfigRaw.data as SystemConfig;
    const telemetryConsent = systemConfig.userPreferences.telemetryConsent;
    if (typeof telemetryConsent === 'boolean') {
      return telemetryConsent;
    }
  } catch (error) {
    console.error('error checking system config', error);
  }
  return undefined;
}

export async function saveTelemetryConsent(
  telemetryConsent: boolean,
): Promise<void> {
  if (systemConfig === null) {
    throw new Error('System config not initialized');
  }
  systemConfig.userPreferences.telemetryConsent = telemetryConsent;
  try {
    await client.putRaw(`/ocpprouter/systemConfig`, systemConfig);
  } catch (error) {
    console.error('Error saving telemetry consent', error);
  }
}

/**
 * TelemetryConsentModal
 *
 * Displays a blocking modal to request consent for telemetry.
 */
export const TelemetryConsentModal: React.FC<TelemetryConsentModalProps> = ({
  visible,
  onDecision,
}) => {
  return (
    <Modal
      open={visible}
      title="Anonymous Metrics Consent"
      closable={false}
      maskClosable={false}
      footer={[
        <Button key="reject" onClick={() => onDecision(false)}>
          Reject
        </Button>,
        <Button key="accept" type="primary" onClick={() => onDecision(true)}>
          Accept
        </Button>,
      ]}
    >
      <p>
        CitrineOS collects anonymous usage metrics to help us improve the
        product. Would you like to send these metrics?
      </p>
    </Modal>
  );
};
