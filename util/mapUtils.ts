import polyline from '@mapbox/polyline'
import bbox from '@turf/bbox'
import center from '@turf/center'

import {
  CompletedActivity,
  CompletedLatLongSegment,
  CompletedPathSegment,
  LatLongPair,
} from '../features/allActivities/activityTypes'
import { InProgressActivity } from '../features/recordActivity/recordingActivityTypes'
import { LatLng } from 'react-native-maps'


interface MapInfo {
  mapSegments: MapSegment[],
  region: MapRegion,
}

interface MapSegment {
  entries: LatLng[],
}

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}


export function toLatLongSegment(segment: CompletedPathSegment): CompletedLatLongSegment {
  console.log('getting location coords', segment)
  return {
    ... segment,
    locationEntries: polyline.decode(segment.path),
  }
}

export function getBoundingRegionForSegments(segments: CompletedLatLongSegment[]) {
  const coords = segments.reduce<LatLongPair[]>((all, seg) => [
    ... all,
    ... seg.locationEntries,
  ], [])
  return getBoundingRegion(coords)
}

export function getBoundingRegionForActivity(activity: CompletedActivity) {
  return getBoundingRegionForSegments(activity.segments.map(toLatLongSegment))
}

export function getBoundingRegion(coords: LatLongPair[]): MapRegion {
  const encoded = polyline.encode(coords)
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

export function getMapInfoForCompletedActivity(activity: CompletedActivity): MapInfo {
  const mapSegments = activity.segments.map<MapSegment>(seg => ({
    entries: polyline.decode(seg.path).map((pair: LatLongPair) => ({
      latitude: pair[0], longitude: pair[1]
    }))
  }))
  const coords = mapSegments.reduce<LatLongPair[]>((all, seg) => [
    ... all,
    ... seg.entries.map<LatLongPair>(loc => [loc.latitude, loc.longitude]),
  ], [])
  return {
    mapSegments,
    region: getBoundingRegion(coords),
  } 
}

export function getMapInfoForInProgressActivity(activity: InProgressActivity): MapInfo {
  const mapSegments = activity.completedSegments.map(seg => ({
    entries: seg.locationEntries,
  }))
  const coords = mapSegments.reduce<LatLongPair[]>((all, seg) => [
    ... all,
    ... seg.entries.map<LatLongPair>(loc => [loc.latitude, loc.longitude]),
  ], [])
  return {
    mapSegments,
    region: getBoundingRegion(coords),
  } 
}
