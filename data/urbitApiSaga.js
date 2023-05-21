import { configureApi } from "@uqbar/react-native-api/configureApi"
import { call, takeEvery } from "redux-saga/effects"
import polyline from '@mapbox/polyline'

let api = null

export function initializeApi(connection) {
  console.log('Initializing Urbit API')
  api = configureApi(connection.ship, connection.shipUrl)
}

export async function poke({ app, mark, json }) {
  console.log(JSON.stringify(json))
  const res = await api.poke({
    app,
    mark,
    json,
  })
  console.log(res)
}

export async function scry({ app, path }) {
  const res = await api.scry({ app, path, })
  return res
}

export function* performPokeRequest({ payload }) {
  console.log(payload)
  yield call(poke, payload)
}

export function* watchPokeRequest() {
  yield takeEvery(POKE_REQUEST, performPokeRequest)
}

const POKE_REQUEST = 'urbit-api/poke-request'
export function pokeRequest(payload) {
  return {
    type: POKE_REQUEST,
    payload,
  }
}

export function* watchScryRequest() {
  yield takeEvery(SCRY_REQUEST, performScryRequest)
}

export function* performScryRequest({ payload }) {
  console.log(payload)
  yield call(scry, payload)
}

const SCRY_REQUEST = 'urbit-api/scry-request'
export function scryRequest(payload) {
  return {
    type: SCRY_REQUEST,
    payload,
  }
}

export function saveActivity(activity) {
  return pokeRequest({
    app: 'trail',
    mark: 'trail-action',
    json: {
      'save-activity': {
        'tracked': toServerActivity(activity),
      }
    }
  })
}

const toServerSegment = serverSegment => {
  return {
    polyline: {
      startTime: serverSegment.startTime,
      endTime: serverSegment.endTime,
      timeElapsed: serverSegment.endTime - serverSegment.startTime,
      distance: serverSegment.distance,
      path: polyline.encode(serverSegment.locationEntries.map(e => [e.latitude, e.longitude]))
    }
  }
}

const toServerActivity = clientActivity => {
  return {
    id: clientActivity.startTime,
    activityType: clientActivity.activityType || 'walk',
    name: clientActivity.name || 'Unnamed Activity',
    timeActive: clientActivity.timeActive,
    timeElapsed: clientActivity.timeElapsed,
    totalDistance: clientActivity.totalDistance,
    segments: clientActivity.completedSegments.map(toServerSegment),
  }
}
