const median = (arr) => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b)
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
}

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

  return Object.keys(map).map((key) => ({
    hour: key,
    value: median(map[key]),
    series,
  }))
}

export const totalSteps = (hours, series) =>
  hours
    .filter((row) => row.series === series)
    .reduce((acc, curr) => {
      return acc + parseInt(curr.value)
    }, 0)

export const totalStepsForRange = (hours, series, range = [0, 24]) => {
  console.log('totalStepsForRange', series, range)
  const rangeMap = createHourMap(range[0], range[1])
  console.log(rangeMap)
  return hours
    .filter((row) => row.series === series)
    .reduce((acc, curr) => {
      if (rangeMap[curr.hour] === undefined) return acc
      return acc + parseInt(curr.value)
    }, 0)
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
