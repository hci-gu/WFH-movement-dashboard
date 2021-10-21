// import { atom, selector } from 'recoil'
import ttest from 'ttest'
import { atom } from 'jotai'

import { diffForHours, getMedian, occupationKey, totalValue } from './utils'
import calcMedian from './utils/median'

export const SETTINGS = {
  num_series: 2,
  createDiff: true,
  displayStepCount: true,
}

export const datasetAtom = atom([])

export const filtersAtom = atom({
  gender: [],
  ageRange: [],
  // index: [1300, 1347],
  index: null,
  // occupations: [
  //   'student',
  //   'studerande',
  //   'retired',
  //   'pensionär',
  // ],
})

export const settingsAtom = atom({
  index: 0,
  showAverage: true,
  sort: true,
  seriesIndex: 0,
})

export const filteredDatasetAtom = atom((get) => {
  const dataset = get(datasetAtom)
  const settings = get(settingsAtom)
  const filters = get(filtersAtom)

  const rows = dataset
    .map((u) => {
      if (SETTINGS.createDiff) {
        return { ...u, ...diffForHours(u.rows) }
      }
      return u
    })
    .filter((u) => u.diff <= 5)
    // .filter((u) => u.before <= 10000 && u.after <= 10000)
    .filter((u) => {
      return Object.keys(filters).every((key) => {
        if (key === 'index') return true
        if (key === 'occupations' && u.occupation) {
          const occupation = occupationKey(u.occupation)
          return filters.occupations.indexOf(occupation) === -1
        } else if (key === 'occupations') {
          return true
        }
        if (filters[key].length) {
          return filters[key].indexOf(u[key]) !== -1
        }
        return true
      })
    })

  let test
  if (rows.length > 0) {
    const diffs = rows.map(({ before, after }) => after - before)
    const result = ttest(diffs)
    test = {
      p: result.pValue(),
      testValue: result.testValue(),
      valid: result.valid(),
      freedom: result.freedom(),
    }
  }

  if (settings.sort) {
    rows.sort((a, b) => a.diff - b.diff)
  }
  if (filters.index) {
    return rows.slice(filters.index[0], filters.index[1])
  }
  return {
    rows,
    test,
  }
})

export const seriesInDatasetAtom = atom((get) => {
  const dataset = get(datasetAtom)

  if (!dataset.length) return []

  const seriesList = dataset
    .find((u) => u.rows.length > SETTINGS.num_series * 23)
    .rows.map(({ series }) => series)

  const uniqueSeries = seriesList
    .filter((item, i, ar) => ar.indexOf(item) === i)
    .map((name, index) => {
      return {
        name,
        index,
      }
    })

  return uniqueSeries
})

export const seriesWithCountAtom = atom((get) => {
  const seriesList = get(seriesInDatasetAtom)
  const dataset = get(filteredDatasetAtom)

  return seriesList.map(({ name, index }) => {
    const usersWithDataInSeries = dataset.rows.filter((u) => {
      return !!u.rows.find((r) => r.series === name)
    })
    const rows = getMedian(dataset.rows, name)
    const total = totalValue(rows)

    return {
      name,
      count: usersWithDataInSeries.length,
      index,
      totalSteps: total,
    }
  })
})

export const datasetAverageAtom = atom((get) => {
  const dataset = get(filteredDatasetAtom)
  const series = get(seriesInDatasetAtom)

  if (!dataset.rows.length) return null

  let array = []

  series.forEach(({ name }) => {
    array = [...array, ...getMedian(dataset.rows, name)]
  })

  return array
})

export const rowSelectorAtom = atom((get) => {
  const dataset = get(filteredDatasetAtom)

  if (!dataset.rows.length) return { rows: [] }

  const average = get(datasetAverageAtom)
  const settings = get(settingsAtom)

  if (settings.showAverage) {
    return {
      rows: average,
      test: dataset.test,
    }
  }
  return {
    rows: dataset.rows[settings.index].rows,
  }
})

export const currentUserSelectorAtom = atom((get) => {
  const dataset = get(filteredDatasetAtom)
  const settings = get(settingsAtom)

  if (settings.showAverage) return null

  return dataset[settings.index]
})

export const occupationsSelectorAtom = atom((get) => {
  const dataset = get(filteredDatasetAtom)
  const dataWithOccupations = dataset.rows.filter((r) => !!r.occupation)

  if (!dataWithOccupations.length) return []

  const occupationsMap = dataWithOccupations.reduce((map, user) => {
    const key = occupationKey(user.occupation)
    if (!map[key]) map[key] = 0
    map[key]++
    return map
  }, {})

  return Object.keys(occupationsMap).map((key) => ({
    name: key,
    value: occupationsMap[key],
  }))
})

export const medianEstimationAtom = atom((get) => {
  const dataset = get(filteredDatasetAtom)

  const estimates = dataset.rows.map((r) => r.stepsEstimate)
  const diffs = dataset.rows.map((r) => r.diff)

  return {
    stepsEstimate: calcMedian(estimates).median,
    diff: calcMedian(diffs).median,
  }
})

export const medianEstimatesAtom = atom((get) => {
  const dataset = get(filteredDatasetAtom)
  const list = [
    // {
    //   name: 'everyone',
    //   filter: () => true,
    // },
    // {
    //   name: 'Male',
    //   filter: ({ gender }) => gender === 'Male',
    // },
    // {
    //   name: 'Female',
    //   filter: ({ gender }) => gender === 'Female',
    // },
    ...['18-24', '25-34', '35-44', '45-54', '55-64', '65-74', '75-84'].map(
      (name) => ({
        name,
        filter: ({ ageRange }) => ageRange === name,
      })
    ),
  ]

  return list.map(({ name, filter }) => {
    const data = dataset.rows.filter(filter)

    const estimates = data.map((r) => r.stepsEstimate)
    const diffs = data.map((r) => r.diff)
    return {
      name,
      count: data.length,
      stepsEstimate: calcMedian(estimates).median,
      change: calcMedian(diffs).median,
    }
  })
})
