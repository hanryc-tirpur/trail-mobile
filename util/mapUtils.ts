import polyline from '@mapbox/polyline'
import bbox from '@turf/bbox'
import center from '@turf/center'

import { CompletedInProgressSegment } from '../features/recordActivity/recordingActivityTypes'


type LatLongPair = [number, number]

export function getBoundingRegion(segments: CompletedInProgressSegment[]) {
  const allCoords = segments.reduce<LatLongPair[]>((all, seg) => {
    return [
      ... all,
      ... seg.locationEntries.map<LatLongPair>(l => [l.latitude, l.longitude])
    ]
  }, [])
  const encoded = polyline.encode(allCoords)
  const geo = polyline.toGeoJSON(encoded)
  const box = bbox(geo)
  const cen = center(geo)
  const region = {
    latitude: cen.geometry.coordinates[1],
    longitude: cen.geometry.coordinates[0],
    latitudeDelta: Math.abs(box[1] - box[3]) * 2,
    longitudeDelta: Math.abs(box[0] - box[2]) * 2,
  }
  return region
}
