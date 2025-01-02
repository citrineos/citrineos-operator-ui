import React from "react";
import { Modal, Button } from "antd";
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

const ENV_FILE_PATH = path.resolve(__dirname, '../.env');
const TELEMETRY_CONSENT_KEY = 'VITE_TELEMETRY_CONSENT';

interface TelemetryConsentModalProps {
    /** Whether the modal is visible */
    visible: boolean;
    /** Handle user decision; receives `true` if user accepts, `false` if user rejects */
    onDecision: (agreed: boolean) => void;
}

export function checkTelemetryConsent(): boolean | undefined {
  const telemetryConsent = process.env[TELEMETRY_CONSENT_KEY];
  if (telemetryConsent == null) {
    return undefined;
  } else {
    return JSON.parse(telemetryConsent);
  }
}

export function saveTelemetryConsent(telemetryConsent: boolean): void {
    if (fs.existsSync(ENV_FILE_PATH)) {
        fs.appendFileSync(ENV_FILE_PATH, `\n${TELEMETRY_CONSENT_KEY}=${telemetryConsent}`);
        // dotenv.config();
    } else {
        console.log('No .env file found... telemetry consent will be asked again on next start.');
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
                CitrineOS collects anonymous usage metrics to help us improve the product.
                Would you like to send these metrics?
            </p>
        </Modal>
    );
};
