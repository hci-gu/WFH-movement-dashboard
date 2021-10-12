import median from './median'

// const median = (arr) => {
//   const mid = Math.floor(arr.length / 2),
//     nums = [...arr].sort((a, b) => a - b)
//   return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
// }

const createHourMap = (from = 0, to = 23) =>
  Array.from({ length: to - from + 1 })
    .map((_, i) => i)
    .reduce((map, i) => {
      const index = from + i
      const key = index > 9 ? `${index}` : `0${index}`
      map[key] = []
      return map
    }, {})

const mapFromHours = (hours) => {
  return hours.reduce((map, { hour, value }) => {
    if (!map[hour]) map[hour] = 0
    map[hour] = map[hour] + value
    return map
  }, {})
}

export const getMedian = (users, series) => {
  const map = createHourMap()
  users.forEach((u) => {
    u.rows
      .filter((row) => row.series === series)
      .forEach(({ hour, value }) => {
        map[hour] = [...map[hour], value]
      })
  })

  return Object.keys(map).map((key) => {
    const medianObj = median(map[key])

    return {
      hour: key,
      ...medianObj,
      value: medianObj.median,
      series,
    }
  })
}

export const totalSteps = (hours, series) =>
  hours
    .filter((row) => row.series === series)
    .reduce((acc, curr) => {
      return acc + parseInt(curr.value)
    }, 0)

export const totalStepsForRange = (hours, series, range = [0, 24]) => {
  const rangeMap = createHourMap(range[0], range[1])
  return hours
    .filter((row) => row.series === series)
    .reduce((acc, curr) => {
      if (rangeMap[curr.hour] === undefined) return acc
      return acc + parseInt(curr.value)
    }, 0)
}

export const totalValue = (hours) =>
  hours.reduce((total, hour) => {
    return total + hour.value
  }, 0)

let count = 0
export const diffForHours = (hours) => {
  const before = totalValue(hours.filter((row) => row.series === 'before'))
  const after = totalValue(hours.filter((row) => row.series === 'after'))
  const percentChange = -((1 - after / before) * 100)

  return {
    before,
    after,
    diff: percentChange,
  }
}

export const totalDiff = (hours) => {
  const hourMap = createHourMap()

  const beforeHours = mapFromHours(
    hours.filter((row) => row.series.indexOf('before') !== -1)
  )
  const afterHours = mapFromHours(
    hours.filter((row) => row.series.indexOf('after') !== -1)
  )

  return Object.keys(hourMap).reduce((total, hour) => {
    return total + Math.abs(beforeHours[hour] - afterHours[hour])
  }, 0)
}

export const occupationKey = (key) => key.split(' ').join('').toLowerCase()

function interpolateColor(color1, color2, factor) {
  if (arguments.length < 3) {
    factor = 0.5
  }
  var result = color1.slice()
  for (var i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]))
  }
  return result
}
// My function to interpolate between two colors completely, returning an array
export const interpolateColors = (color1, color2, steps) => {
  let stepFactor = 1 / (steps - 1),
    interpolatedColorArray = []

  color1 = color1.match(/\d+/g).map(Number)
  color2 = color2.match(/\d+/g).map(Number)

  for (let i = 0; i < steps; i++) {
    interpolatedColorArray.push(
      interpolateColor(color1, color2, stepFactor * i)
    )
  }

  return interpolatedColorArray
}

const mode = 'user'
const calendarColors = interpolateColors(
  'rgba(50, 50, 180,0.75)',
  'rgba(225, 50, 50,0.75)',
  24
)

const colorForIndex = (i) => {
  const color = calendarColors[i]
  if (color) {
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
  }
  return 'rgba(0,0,0,0.25)'
}

export const colorForSeries = (series, seriesList) => {
  if (mode === 'calendar') {
    const match = seriesList.find(({ name }) => name === series)
    return colorForIndex(match.index)
  }
  const value = parseInt(series.replace(/^\D+/g, ''))
  const index = series.indexOf('before') !== -1 ? 12 - value : 11 + value
  return colorForIndex(index)
}
export const colorForIndexAndName = (index, series) => {
  if (mode === 'calendar') {
    return colorForIndex(index)
  }
  const value = parseInt(series.replace(/^\D+/g, ''))
  const modifiedIndex =
    series.indexOf('before') !== -1 ? 12 - value : 11 + value
  return colorForIndex(modifiedIndex)
}
