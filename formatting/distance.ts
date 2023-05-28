import { Distance, DistanceUnit } from '../util/distanceCalculator'

export function toDistanceText(distance: Distance) {
  return `${distance.val.toFixed(2)} ${toDistanceUnitText(distance.unit)}`
}

export function toDistanceUnitText(unit: DistanceUnit) {
  return unit === DistanceUnit.Km ? 'km' : 'mi'
}
