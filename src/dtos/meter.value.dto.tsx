import {
  IMeterValueDto,
  SampledValue,
  MeasurandEnumType,
} from '@citrineos/base';
import { ReadingContextEnumType } from '@OCPP2_0_1';

export class MeterValueDto implements Partial<IMeterValueDto> {
  id?: number;
  transactionEventId?: number | null;
  transactionDatabaseId?: number | null;
  sampledValue!: [SampledValue, ...SampledValue[]];
  timestamp!: string;
  connectorId?: number | null;
}

// todo share below code with @citrineos/base
const TWO_HOURS = 60 * 60 * 2;

const validContexts = new Set([
  ReadingContextEnumType.Transaction_Begin,
  ReadingContextEnumType.Sample_Periodic,
  ReadingContextEnumType.Transaction_End,
]);

export const getTimestampToMeasurandArray = (
  sortedMeterValues: IMeterValueDto[],
  measurand: MeasurandEnumType,
  validContextsArg: Set<ReadingContextEnumType>,
): [number, string][] => {
  if (sortedMeterValues.length === 0) return [];

  const baseTime = sortedMeterValues[0].timestamp;
  const result: [number, string][] = [];

  for (const meterValue of sortedMeterValues) {
    if (
      !meterValue.sampledValue[0].context ||
      (typeof meterValue.sampledValue[0].context === 'string' &&
        validContextsArg.has(
          meterValue.sampledValue[0].context as ReadingContextEnumType,
        ))
    ) {
      const overallValue = findOverallValue(meterValue.sampledValue, measurand);
      if (overallValue) {
        const timestampEpoch = meterValue.timestamp;
        // @ts-expect-error timestamp is moment object
        const elapsedTime = (timestampEpoch - baseTime) / 1000;
        if (elapsedTime > TWO_HOURS) {
          // skip weird data // todo is needed?
          console.warn(
            `Skipping data for ${elapsedTime} seconds, more than 2 hours from base time`,
          );
          continue;
        }
        const normalizedValue = normalizeValue(overallValue);
        if (normalizedValue !== null) {
          result.push([elapsedTime, normalizedValue]);
        }
      }
    }
  }

  return result;
};

export const findOverallValue = (
  sampledValues: SampledValue[],
  measurand: MeasurandEnumType,
): SampledValue | undefined => {
  const measurandSampledValues = sampledValues.filter(
    (sv) =>
      sv.measurand === measurand ||
      (!sv.measurand &&
        measurand === MeasurandEnumType.Energy_Active_Import_Register),
  );
  if (measurandSampledValues.length === 0) {
    return undefined;
  }
  let summedPhasesSampledValue = measurandSampledValues.find((sv) => !sv.phase);
  if (!summedPhasesSampledValue) {
    // Manually sum all phases if no summed phase is found
    const summablePhases = ['L1', 'L2', 'L3'];
    const summableSampledValues = measurandSampledValues.filter(
      (sv) =>
        sv.phase &&
        summablePhases.includes(sv.phase as string) &&
        typeof sv.value === 'number' &&
        !isNaN(Number(sv.value)),
    );
    if (summableSampledValues.length < 3) {
      return undefined; // Not all phases are present, cannot sum
    }
    const summedPhasesValue = summableSampledValues.reduce(
      (acc, sv) => acc + Number(sv.value),
      0,
    );
    summedPhasesSampledValue = {
      ...measurandSampledValues[0],
      value: summedPhasesValue,
      phase: null,
    };
  }
  return summedPhasesSampledValue;
};

export const normalizeValue = (overallValue: SampledValue): string | null => {
  if (typeof overallValue.value !== 'number') return null;
  return overallValue.value.toFixed(2);
};
