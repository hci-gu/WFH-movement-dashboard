import { atom, selector, selectorFamily } from 'recoil'
import moment from 'moment'

export const dashboardState = atom({
  key: 'dashboard',
  default: null,
})

export const fromDateState = atom({
  key: 'from-date',
  default: moment().subtract(30, 'days').format('YYYY-MM-DD'),
})

export const dashBoardValue = selectorFamily({
  key: 'dashboard-value',
  get: (key) => ({ get }) => {
    const dashboard = get(dashboardState)

    return dashboard ? dashboard[key] : 0
  },
})

export const userRegistrationsState = atom({
  key: 'user-registrations',
  default: [],
})

export const usersByDay = selector({
  key: 'users-by-day',
  get: ({ get }) => {
    const users = get(userRegistrationsState)
    let firstDate = get(fromDateState)
    if (!users.length) return []
    if (!firstDate) {
      firstDate = users[0].date
    }

    const apps = {
      'WFH Movement': {},
      'SFH Movement': {},
    }

    const usersForDay = users.reduce((acc, u) => {
      const day = moment(u.date).format('YYYY-MM-DD')
      const app = acc[u.app]

      if (!app[day]) {
        app[day] = 1
      } else {
        app[day]++
      }
      return acc
    }, apps)

    const days = Array.from({
      length: moment().diff(firstDate, 'days') + 2,
    })
      .map((_, i) => moment(firstDate).add(i, 'days').format('YYYY-MM-DD'))
      .reduce((acc, date) => {
        acc[date] = {
          'WFH Movement': usersForDay['WFH Movement'][date]
            ? usersForDay['WFH Movement'][date]
            : 0,
          'SFH Movement': usersForDay['SFH Movement'][date]
            ? usersForDay['SFH Movement'][date]
            : 0,
        }
        return acc
      }, {})

    return Object.keys(days).map((key) => ({
      date: key,
      ...days[key],
    }))
  },
})

export const usersForDay = selectorFamily({
  key: 'users-for-day',
  get: (day) => ({ get }) => {
    const usersDates = get(userRegistrationsState)

    const apps = {
      'WFH Movement': {},
      'SFH Movement': {},
    }

    const usersForHour = usersDates
      .filter(({ date }) => moment(date).diff(moment(day), 'days') === 0)
      .reduce((acc, u) => {
        const app = acc[u.app]
        const hour = moment(u.date).format('HH')
        if (!app[hour]) {
          app[hour] = 1
        } else {
          app[hour]++
        }
        return acc
      }, apps)
    console.log(usersForHour)

    const hours = Array.from({ length: 24 })
      .map((_, i) => moment(day).add(i, 'hours').format('HH'))
      .reduce((acc, date) => {
        acc[date] = {
          'WFH Movement': usersForHour['WFH Movement'][date]
            ? usersForHour['WFH Movement'][date]
            : 0,
          'SFH Movement': usersForHour['SFH Movement'][date]
            ? usersForHour['SFH Movement'][date]
            : 0,
        }
        return acc
      }, {})

    return Object.keys(hours).map((key) => ({
      date: key,
      ...hours[key],
    }))
  },
})
