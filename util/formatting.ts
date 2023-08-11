import { DateTime } from 'luxon'

const msPerSec = 1000
const msPerMin = 60 * msPerSec
const msPerHour = 60 * msPerMin


export function toActivityDate(ms: number) {
  const time = DateTime.fromMillis(ms)
  return `${time.toLocaleString(DateTime.DATE_FULL)} at ${time.toLocaleString(DateTime.TIME_SIMPLE)}`
}

export function formatTimespan(timespanMs: number) {
  const hours = Math.floor(timespanMs / msPerHour)
  timespanMs -= hours * msPerHour
  const minutes = Math.floor(timespanMs / msPerMin)
  timespanMs -= minutes * msPerMin
  const seconds = Math.floor(timespanMs / msPerSec)
  timespanMs -= seconds * msPerSec
  const msDigit = Math.floor(timespanMs / 100)

  return `${padZeroes(minutes)}:${padZeroes(seconds)}.${msDigit}`
}

function padZeroes(num: number) {
  const numStr = num.toString()
  return numStr.length === 1 ? `0${numStr}` : numStr
}

