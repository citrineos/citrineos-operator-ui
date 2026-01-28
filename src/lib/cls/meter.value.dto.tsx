// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import type {
  MeasurandEnumType,
  MeterValueDto,
  SampledValue,
} from '@citrineos/base';
import { MeasurandEnum, OCPP2_0_1 } from '@citrineos/base';

export class MeterValueClass implements Partial<MeterValueDto> {}

// todo share below code with @citrineos/base
const TWO_HOURS = 60 * 60 * 2;

const validContexts = new Set([
  OCPP2_0_1.ReadingContextEnumType.Transaction_Begin,
  OCPP2_0_1.ReadingContextEnumType.Sample_Periodic,
  OCPP2_0_1.ReadingContextEnumType.Transaction_End,
]);

export const getTimestampToMeasurandArray = (
  sortedMeterValues: MeterValueDto[],
  measurand: MeasurandEnumType,
  validContextsArg: Set<OCPP2_0_1.ReadingContextEnumType>,
): [number, string][] => {
  if (sortedMeterValues.length === 0) return [];

  const baseTime = new Date(sortedMeterValues[0].timestamp).getTime();
  const result: [number, string][] = [];

  for (const meterValue of sortedMeterValues) {
    if (
      !meterValue.sampledValue[0].context ||
      (typeof meterValue.sampledValue[0].context === 'string' &&
        validContextsArg.has(
          meterValue.sampledValue[0]
            .context as OCPP2_0_1.ReadingContextEnumType,
        ))
    ) {
      const overallValue = findOverallValue(
        meterValue.sampledValue as unknown as SampledValue[],
        measurand,
      );
      if (overallValue) {
        const timestampEpoch = new Date(meterValue.timestamp).getTime();
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
      (!sv.measurand && // Measurand defaults to Energy.Active.Import.Register
        measurand === MeasurandEnum['Energy.Active.Import.Register']),
  );
  if (measurandSampledValues.length === 0) {
    return undefined;
  }
  let summedPhasesSampledValue = measurandSampledValues.find((sv) => !sv.phase);
  if (!summedPhasesSampledValue) {
    // Manually sum all phases if no summed phase is found
    const summablePhases = new Set<string>([
      OCPP2_0_1.PhaseEnumType.L1,
      OCPP2_0_1.PhaseEnumType.L2,
      OCPP2_0_1.PhaseEnumType.L3,
    ]);
    const summableSampledValues = measurandSampledValues.filter(
      (sv) => sv.phase && summablePhases.has(sv.phase),
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
  let powerOfTen = overallValue.unitOfMeasure?.multiplier ?? 0;
  const unit = overallValue.unitOfMeasure?.unit?.toUpperCase();
  switch (unit) {
    case 'KWH':
      break;
    case 'WH':
    case 'W':
    case undefined:
      powerOfTen -= 3;
      break;
    case 'PERCENT':
      powerOfTen -= 2;
      break;
    case 'V':
    case 'A':
      break;
    default:
      throw new Error(
        `Unknown unit for measurand ${overallValue.measurand} unit ${unit} `,
      );
  }

  return (overallValue.value * 10 ** powerOfTen).toFixed(2);
};
