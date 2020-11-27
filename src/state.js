import { atom, selector, selectorFamily } from 'recoil'
import moment from 'moment'

export const dashboardState = atom({
  key: 'dashboard',
  default: null,
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
    const usersDates = get(userRegistrationsState)
    const firstDate = usersDates[0]

    const usersForDay = usersDates.reduce((acc, date) => {
      const day = moment(date).format('YYYY-MM-DD')
      if (!acc[day]) {
        acc[day] = 1
      } else {
        acc[day]++
      }
      return acc
    }, {})

    const days = Array.from({
      length: moment().diff(firstDate, 'days') + 2,
    })
      .map((_, i) => moment(firstDate).add(i, 'days').format('YYYY-MM-DD'))
      .reduce((acc, date) => {
        acc[date] = usersForDay[date] ? usersForDay[date] : 0
        return acc
      }, {})

    return Object.keys(days).map((key) => ({
      date: key,
      users: days[key],
    }))
  },
})

export const usersForDay = selectorFamily({
  key: 'users-for-day',
  get: (day) => ({ get }) => {
    const usersDates = get(userRegistrationsState)
    console.log('usersDates', usersDates)

    const usersForHour = usersDates
      .filter((date) => moment(date).diff(moment(day), 'days') === 0)
      .reduce((acc, date) => {
        const hour = moment(date).format('HH')
        if (!acc[hour]) {
          acc[hour] = 1
        } else {
          acc[hour]++
        }
        return acc
      }, {})
    console.log(usersForHour)

    const hours = Array.from({ length: 24 })
      .map((_, i) => moment(day).add(i, 'hours').format('HH'))
      .reduce((acc, hour) => {
        return [
          ...acc,
          { date: hour, users: usersForHour[hour] ? usersForHour[hour] : 0 },
        ]
      }, [])
    console.log(hours)
    return hours
  },
})
