import moment from 'moment'
// eslint-disable-next-line no-restricted-globals
const ctx = self

const sortNumbers = (a, b) => a - b
const median = (arr) => arr.sort(sortNumbers)[Math.floor(arr.length / 2)]
const mean = (arr) =>
  arr.length === 0 ? 0 : arr.reduce((sum, value) => sum + value, 0) / arr.length
const isWeekend = (date) => {
  const day = moment(date).day()
  return day === 6 || day === 0
}

const createBeforeAndAfterDays = (
  users,
  {
    monthsBefore = 3,
    monthsAfter = 3,
    includeWeekends = true,
    useMedian = true,
  } = {}
) => {
  const f = useMedian ? median : mean

  return users.map((user) => {
    const compareDate = user.compareDate
    const days = user.days

    const daysBefore = days.filter(
      ({ date }) =>
        new Date(date) < new Date(compareDate) &&
        moment(date).isAfter(
          moment(compareDate).subtract(monthsBefore, 'months')
        ) &&
        (includeWeekends ? true : !isWeekend(date))
    )
    const daysAfter = days.filter(
      ({ date }) =>
        new Date(date) >= new Date(compareDate) &&
        moment(date).isBefore(moment(compareDate).add(monthsAfter, 'months')) &&
        (includeWeekends ? true : !isWeekend(date))
    )
    const stepsBefore = f(daysBefore.map(({ value }) => value))
    const stepsAfter = f(daysAfter.map(({ value }) => value))

    return {
      ...user,
      daysBefore,
      daysAfter,
      stepsBefore,
      stepsAfter,
      stepsDifference: stepsAfter / stepsBefore - 1,
    }
  })
}

ctx.addEventListener('message', (event) => {
  const { users, settings } = event.data

  ctx.postMessage(createBeforeAndAfterDays(users, settings))
})
