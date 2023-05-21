import { LocationEntry } from "../features/recordActivity/activitySlice"

export type Distance = {
  val: number,
  unit: DistanceUnit,
}

export enum DistanceUnit {
  Mile = 'mile',
  Km = 'km',
}


const conversion = {
  [DistanceUnit.Km]: {
    [DistanceUnit.Km]: 1.0,
    [DistanceUnit.Mile]: 0.6213712,  // km to mi
  },
  [DistanceUnit.Mile]: {
    [DistanceUnit.Km]: 1.609344,   // mi to km
    [DistanceUnit.Mile]: 1.0,
  },
}

let selectedUnit: DistanceUnit | null = null

export function setDistanceUnit(unit: DistanceUnit) {
  selectedUnit = unit
}

export function addDistances(d1: Distance, d2: Distance): Distance {
  assertIsNotNull(selectedUnit)

  const d1Multiplier = conversion[d1.unit][selectedUnit]
  const d2Multiplier = conversion[d2.unit][selectedUnit]
  return {
    val: d1.val * d1Multiplier + d2.val * d2Multiplier,
    unit: selectedUnit,
  }
}

export function computeDistance(prev: LocationEntry, current: LocationEntry): Distance {
  assertIsNotNull(selectedUnit)

  const { latitude: prevLat, longitude: prevLong } = prev
  const { latitude: lat, longitude: long } = current
  const prevLatInRad = toRad(prevLat)
  const prevLongInRad = toRad(prevLong)
  const latInRad = toRad(lat)
  const longInRad = toRad(long)
  const unitMultiplier = conversion[DistanceUnit.Km][selectedUnit]

  return {
    val: (
      6377.830272 * // In kilometers
      unitMultiplier *
      Math.acos(
        Math.sin(prevLatInRad) * Math.sin(latInRad) +
          Math.cos(prevLatInRad) * Math.cos(latInRad) * Math.cos(longInRad - prevLongInRad),
      )
    ),
    unit: selectedUnit,
  }
}

export function convertDistance({ val, unit }: Distance) {
  assertIsNotNull(selectedUnit)

  const unitMultiplier = conversion[unit][selectedUnit]
  return {
    val: val * unitMultiplier,
    unit: selectedUnit,
  }
}

export function getZeroDistance(): Distance {
  return {
    val: 0,
    unit: selectedUnit === null ? DistanceUnit.Km : selectedUnit,
  }
}

function toRad(angle: number) {
  return (angle * Math.PI) / 180.0
}

function assertIsNotNull<T>(val: T): asserts val is NonNullable<T> {
  if (val === null) {
    throw Error(
      `Expected 'val' to be defined, but received ${val}`
    );
  }
}
