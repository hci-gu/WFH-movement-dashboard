import moment from 'moment'
import ttest from 'ttest'

const median = arr => arr.sort()[Math.floor(arr.length/2)]
const mean = arr => arr.length === 0 ? 0 : arr.reduce((sum, value) => sum + value, 0) / arr.length

const createBeforeAndAfterDays = (users, { monthsBefore = 3, monthsAfter = 3 } = {}) =>
  users.map(user => {
    const compareDate = user.compareDate
    const days = user.days

    const daysBefore = days
      .filter(({ date }) => new Date(date) < new Date(compareDate) && moment(date).isAfter(moment(compareDate).subtract(monthsBefore, 'months')))
    const daysAfter = days
      .filter(({ date }) => new Date(date) >= new Date(compareDate) && moment(date).isBefore(moment(compareDate).add(monthsAfter, 'months')))

      return {
        ...user,
        daysBefore,
        daysAfter,
      }
  })

const analyse = (users, { useMedian = true } = {}) => {
  const beforeAfter = users
    .map(({daysBefore, daysAfter}) => {
      const f = useMedian ? median : mean
      return [
        f(daysBefore.map(({ value }) => value)),
        f(daysAfter.map(({ value }) => value)),
      ]
    })

  if (beforeAfter.some(([a, b]) => Number.isNaN(a) || Number.isNaN(b) || a === undefined || b === undefined))
    throw new Error('error in data')

  const diffs = beforeAfter.map(([ before, after ]) => (after || 0) - before)

  // manual calculation, left to ttest-package
  // const avgDiff = diffs.reduce((sum, diff) => sum + diff, 0) / medians.length
  // const sdDiff = Math.sqrt(diffs.reduce((sum, diff) => sum + (diff - avgDiff) * (diff - avgDiff), 0) / (medians.length))
  // const t = avgDiff / (sdDiff/Math.sqrt(medians.length))
  // console.log({ avgDiff, sdDiff, t })

  // const test = ttest(medians.map(([x]) => x), medians.map(([,x]) => x))
  const test = ttest(diffs)
  console.log({ p: test.pValue(), testValue: test.testValue(), valid: test.valid(), freedom: test.freedom()}) // , conf: test.confidence()})

  return {
    // avgDiff, sdDiff, t,
    p: test.pValue(),
    testValue: test.testValue(),
    valid: test.valid(),
    freedom: test.freedom(),
    before: mean(beforeAfter.map(([x]) => x)),
    after: mean(beforeAfter.map(([, x]) => x)),
  }
}

export {
  analyse,
  createBeforeAndAfterDays,
}