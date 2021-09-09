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

const userEstimatedWrong = (estimate, change) => {
  return (estimate > 0 && change < 0) || (estimate < 0 && change > 0)
}

const getPercentageChange = (before, after) => {
  return (after - before) / before
}

const createBeforeAndAfterDays = (
  users,
  {
    monthsBefore = 3,
    monthsAfter = 3,
    includeWeekends = true,
    useMedian = true,
    fixedWFHDate = null,
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
    const change = getPercentageChange(stepsBefore, stepsAfter)

    const result = {
      ...user,
      daysBefore,
      daysAfter,
      stepsBefore,
      stepsAfter,
      stepsDifference: stepsAfter / stepsBefore - 1,
      change,
      estimatedWrong: userEstimatedWrong(user.stepsEstimate, change),
      totalSteps: days.reduce((acc, curr) => {
        return acc + curr.value
      }, 0),
    }

    if (fixedWFHDate) {
      const daysBeforeFixed = days.filter(
        ({ date }) =>
          new Date(date) < new Date(fixedWFHDate) &&
          moment(date).isAfter(
            moment(fixedWFHDate).subtract(monthsBefore, 'months')
          ) &&
          (includeWeekends ? true : !isWeekend(date))
      )
      const daysAfterFixed = days.filter(
        ({ date }) =>
          new Date(date) >= new Date(fixedWFHDate) &&
          moment(date).isBefore(
            moment(fixedWFHDate).add(monthsAfter, 'months')
          ) &&
          (includeWeekends ? true : !isWeekend(date))
      )
      const stepsBeforeFixed = f(daysBeforeFixed.map(({ value }) => value))
      const stepsAfterFixed = f(daysAfterFixed.map(({ value }) => value))
      const changeFixed = getPercentageChange(stepsBeforeFixed, stepsAfterFixed)

      result.daysBeforeFixed = daysBeforeFixed
      result.daysAfterFixed = daysAfterFixed
      result.stepsBeforeFixed = stepsBeforeFixed
      result.stepsAfterFixed = stepsAfterFixed
      result.stepsDifferenceFixed = stepsAfterFixed / stepsBeforeFixed - 1
      result.changeFixed = changeFixed
    }

    return result
  })
}

ctx.addEventListener('message', (event) => {
  const { users, settings } = event.data

  ctx.postMessage(createBeforeAndAfterDays(users, settings))
})
