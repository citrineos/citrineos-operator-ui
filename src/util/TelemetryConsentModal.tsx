import React from "react";
import { Modal, Button } from "antd";
import { BaseRestClient } from "./BaseRestClient";

const TELEMETRY_CONSENT_KEY = 'TELEMETRY_CONSENT';
const client = new BaseRestClient(true);

interface TelemetryConsentModalProps {
    /** Whether the modal is visible */
    visible: boolean;
    /** Handle user decision; receives `true` if user accepts, `false` if user rejects */
    onDecision: (agreed: boolean) => void;
}

export async function checkTelemetryConsent(): Promise<Boolean | undefined> {
  console.log("Checking telemetry consent");
  const telemetryConsent = await client.getRaw(`/ocpprouter/userPreferences?key=${TELEMETRY_CONSENT_KEY}`, {});
  console.log("telemetryConsent ", telemetryConsent);
  try {
    const telemetryConsentData = JSON.parse(telemetryConsent.data as string);
    if (typeof telemetryConsentData === 'boolean') {
      console.log("Consent found: ", telemetryConsentData);
      return telemetryConsentData;
    }
  } catch (error) {
    // pass
  }
  console.log("No telemetry consent found");
  return undefined;
}

export function saveTelemetryConsent(telemetryConsent: boolean): void {
    console.log("Saving telemetry consent");
    client.put(`/ocpprouter/userPreferences?key=${TELEMETRY_CONSENT_KEY}&value=${telemetryConsent}`, Boolean, {}, undefined);
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
