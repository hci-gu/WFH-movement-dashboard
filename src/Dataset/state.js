import { atom, selector } from 'recoil'
import {
  diffForHours,
  getMedian,
  occupationKey,
  totalDiff,
  totalValue,
} from './utils'

export const SETTINGS = {
  num_series: 2,
  createDiff: true,
  displayStepCount: true,
}

export const datasetAtom = atom({
  key: 'dataset',
  default: [],
})

export const filtersAtom = atom({
  key: 'filters',
  default: {
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
  },
})

export const settingsAtom = atom({
  key: 'settings',
  default: {
    index: 0,
    showAverage: true,
    sort: true,
  },
})

export const filteredDatasetAtom = selector({
  key: 'filtered-dataset',
  get: ({ get }) => {
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
      .filter((u) => u.before !== 0 && u.after !== 0)
      .filter((u) => u.before <= 10000 && u.after <= 10000)
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

    if (settings.sort) {
      rows.sort((a, b) => a.diff - b.diff)
    }
    if (filters.index) {
      return rows.slice(filters.index[0], filters.index[1])
    }
    return rows
  },
})

export const seriesInDatasetAtom = selector({
  key: 'series-in-dataset',
  get: ({ get }) => {
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
  },
})

export const seriesWithCountAtom = selector({
  key: 'series-with-count',
  get: ({ get }) => {
    const seriesList = get(seriesInDatasetAtom)
    const dataset = get(filteredDatasetAtom)

    return seriesList.map(({ name, index }) => {
      const usersWithDataInSeries = dataset.filter((u) => {
        return !!u.rows.find((r) => r.series === name)
      })
      const rows = getMedian(dataset, name)
      const total = totalValue(rows)

      return {
        name,
        count: usersWithDataInSeries.length,
        index,
        totalSteps: total,
      }
    })
  },
})

export const datasetAverageAtom = selector({
  key: 'dataset-average',
  get: ({ get }) => {
    const dataset = get(filteredDatasetAtom)
    const series = get(seriesInDatasetAtom)

    if (!dataset.length) return null

    let array = []

    series.forEach(({ name }) => {
      array = [...array, ...getMedian(dataset, name)]
    })

    return array
  },
})

export const rowSelectorAtom = selector({
  key: 'row-selector',
  get: ({ get }) => {
    const dataset = get(filteredDatasetAtom)

    if (!dataset.length) return []

    const average = get(datasetAverageAtom)
    const settings = get(settingsAtom)

    if (settings.showAverage) {
      return average
    }
    return dataset[settings.index].rows
  },
})

export const currentUserSelectorAtom = selector({
  key: 'current-user',
  get: ({ get }) => {
    const dataset = get(filteredDatasetAtom)
    const settings = get(settingsAtom)

    if (settings.showAverage) return null

    return dataset[settings.index]
  },
})

export const occupationsSelectorAtom = selector({
  key: 'occupations',
  get: ({ get }) => {
    const dataset = get(filteredDatasetAtom)
    const dataWithOccupations = dataset.filter((r) => !!r.occupation)

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
  },
})
