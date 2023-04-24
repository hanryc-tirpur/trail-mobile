import { configureApi } from "@uqbar/react-native-api/configureApi";
import { call, takeEvery } from "redux-saga/effects";

let api = null

export function initializeApi(connection) {
  console.log('Initializing Urbit API')
  api = configureApi(connection.ship, connection.shipUrl)
}

export async function poke({ app, path }) {
  const res = await api.poke({
    app: 'trail',
    mark: 'trail-action'
  })
  console.log(res)
}

export async function scry({ app, path }) {
  const res = await api.scry({ app, path, })
  console.log(res)
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
