// import all from './allActivities-live.json' assert { type: 'json' }
const all = require('./allActivities-live')

// console.log(all)
const first = all.unsavedActivities.filter(a => a.totalDistance === null)[0]
const entries = first.completedSegments[0].locationEntries

for(let i = 1; i < entries.length; i += 1) {
  let prev = entries[i - 1]
  let next = entries[i]
  let computed = computeDistance(prev, next)
  if(isNaN(computed)) {
    console.log(computed, prev, next)
  }
}

function computeDistance({ latitude: prevLat, longitude: prevLong }, { latitude: lat, longitude: long }) {
  const prevLatInRad = toRad(prevLat)
  const prevLongInRad = toRad(prevLong)
  const latInRad = toRad(lat)
  const longInRad = toRad(long)

  return (
    // In kilometers
    6377.830272 *
    Math.acos(
      Math.sin(prevLatInRad) * Math.sin(latInRad) +
        Math.cos(prevLatInRad) * Math.cos(latInRad) * Math.cos(longInRad - prevLongInRad),
    )
  )
}

function toRad(angle) {
  return (angle * Math.PI) / 180
}


