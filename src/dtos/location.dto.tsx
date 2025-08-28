import { ILocationDto, IChargingStationDto } from '@citrineos/base';
import { Point } from 'geojson';

export class LocationDto implements Partial<ILocationDto> {
  coordinates!: Point;

  chargingPool!: IChargingStationDto[];
}
