import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

const resource = new Resource({
    [ATTR_SERVICE_NAME]: 'citrineos-operator-ui'
  });
  
const metricsExporter = new OTLPMetricExporter({
  // URL of the OTel Collector or backend
  url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT || 'http://otel-collector:4317'
});

const metricReader = new PeriodicExportingMetricReader({
    exporter: metricsExporter,
    exportIntervalMillis: 3000
});

const sdk = new NodeSDK({
  resource: resource,
  metricReader: metricReader,
  instrumentations: [getNodeAutoInstrumentations()]
});

// Start the SDK before your application
sdk.start();
