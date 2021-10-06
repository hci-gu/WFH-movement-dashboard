import { atom, selector } from 'recoil'
import { getMedian, occupationKey, totalDiff } from './utils'

export const datasetAtom = atom({
  key: 'dataset',
  default: [],
})

export const filtersAtom = atom({
  key: 'filters',
  default: {
    gender: null,
    ageRange: null,
    // index: [1300, 1347],
    index: null,
    occupations: [],
    // occupations: [
    //   'student',
    //   'studerande',
    //   'sebastiantestaaaaar',
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
      .map((u) => ({ ...u, diff: totalDiff(u.rows) }))
      .filter((u) => u.diff > 1)
      .filter((u) => {
        return Object.keys(filters).every((key) => {
          if (key === 'index') return true
          if (key === 'occupations' && u.occupation) {
            const occupation = occupationKey(u.occupation)
            return filters[key].indexOf(occupation) === -1
          } else if (key === 'occupations') {
            return true
          }
          if (filters[key]) {
            return u[key] === filters[key]
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
    console.log('rows', rows)
    return rows
  },
})

export const seriesInDatasetAtom = selector({
  key: 'series-in-dataset',
  get: ({ get }) => {
    const dataset = get(datasetAtom)

    if (!dataset.length) return []

    const seriesList = dataset
      .find((u) => u.rows.length > 1000)
      .rows.map(({ series }) => series)

    return seriesList.filter((item, i, ar) => ar.indexOf(item) === i)
  },
})

export const datasetAverageAtom = selector({
  key: 'dataset-average',
  get: ({ get }) => {
    const dataset = get(filteredDatasetAtom)
    const series = get(seriesInDatasetAtom)
    console.log('average', series)

    if (!dataset.length) return null

    let array = []

    series.forEach((key) => {
      array = [...array, ...getMedian(dataset, key)]
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
