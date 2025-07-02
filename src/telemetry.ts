// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import config from '@util/config';

let isTelemetryEnabled = false; // tracks whether we've initialized telemetry
let requestCount: any | null = null;

export function initTelemetry() {
  if (isTelemetryEnabled) {
    return; // Already initialized; do nothing
  }

  const resource = new Resource({
    [ATTR_SERVICE_NAME]: 'citrineos-operator-ui',
  });

  const metricExporter = new OTLPMetricExporter({
    url: config.metricsUrl,
  });

  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 60000, // Adjust interval as needed
  });

  // Create a MeterProvider with a custom resource to identify this service
  const meterProvider = new MeterProvider({
    resource: resource,
    readers: [metricReader],
  });

  // Retrieve a Meter instance
  const meter = meterProvider.getMeter('citrineos-operator-ui');

  // Create a counter instrument
  requestCount = meter.createCounter('requests_count', {
    description: 'Number of requests made',
  });

  isTelemetryEnabled = true;
}

export function incrementRequestCount(attributes: Record<string, string> = {}) {
  if (!isTelemetryEnabled || !requestCount) {
    // Telemetry is disabled or not yet initialized.
    return;
  }

  requestCount.add(1, attributes);
}
