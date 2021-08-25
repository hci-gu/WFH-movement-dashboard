import ttest from 'ttest'
import AnalysisWorker from './analysis.worker.js'

// values|result [[x,y]...]
export function findLineByLeastSquares(values) {
  let sum_x = 0
  let sum_y = 0
  let sum_xy = 0
  let sum_xx = 0
  let count = 0

  /*
   * We'll use those variables for faster read/write access.
   */
  let x = 0
  let y = 0

  /*
   * Calculate the sum for each of the parts necessary.
   */
  for (let v = 0; v < values.length; v++) {
    x = values[v][0]
    y = values[v][1]
    sum_x += x
    sum_y += y
    sum_xx += x * x
    sum_xy += x * y
    count++
  }

  /*
   * Calculate m and b for the formular:
   * y = x * m + b
   */
  const m = (count * sum_xy - sum_x * sum_y) / (count * sum_xx - sum_x * sum_x)
  const b = sum_y / count - (m * sum_x) / count

  /*
   * We will make the x and y result line now
   */
  const result = []

  for (let v = 0; v < values.length; v++) {
    x = values[v][0]
    y = x * m + b
    result.push([x, y])
  }

  return {
    slope: m,
    values: result,
  }
}

const mean = (arr) =>
  arr.length === 0 ? 0 : arr.reduce((sum, value) => sum + value, 0) / arr.length

const analyse = (users) => {
  const beforeAfter = users.map(({ stepsBefore, stepsAfter }) => {
    return [stepsBefore, stepsAfter]
  })

  if (
    beforeAfter.some(
      ([a, b]) =>
        Number.isNaN(a) || Number.isNaN(b) || a === undefined || b === undefined
    )
  )
    throw new Error('error in data')

  const diffs = beforeAfter.map(([before, after]) => (after || 0) - before)

  // manual calculation, left to ttest-package
  // const avgDiff = diffs.reduce((sum, diff) => sum + diff, 0) / medians.length
  // const sdDiff = Math.sqrt(diffs.reduce((sum, diff) => sum + (diff - avgDiff) * (diff - avgDiff), 0) / (medians.length))
  // const t = avgDiff / (sdDiff/Math.sqrt(medians.length))
  // console.log({ avgDiff, sdDiff, t })

  // const test = ttest(medians.map(([x]) => x), medians.map(([,x]) => x))
  const test = ttest(diffs)

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

function createGroups(arr, numGroups) {
  const perGroup = Math.ceil(arr.length / numGroups)
  return new Array(numGroups)
    .fill('')
    .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup))
}

const runWorker = (users, settings) => {
  return new Promise((resolve) => {
    const worker = new AnalysisWorker()
    worker.addEventListener('message', (e) => {
      worker.terminate()
      resolve(e.data)
    })

    worker.postMessage({ users, settings })
  })
}

const runAnalysis = (users, settings) => {
  return new Promise(async (resolve) => {
    const filteredUsers = users.filter(
      ({ compareDate, days }) => compareDate && days && days.length > 0
    )
    const userChunks = createGroups(filteredUsers, settings.workers)
    const processedChunks = await Promise.all(
      userChunks.map((chunk) => runWorker(chunk, settings))
    )
    const dataUsers = processedChunks
      .flat()
      .filter(
        ({ daysBefore, daysAfter }) =>
          daysBefore.filter(({ value }) => value > 0).length /
            daysBefore.length >
          1 - settings.maxMissingDaysBefore
      )
      .filter(
        ({ daysBefore, daysAfter }) =>
          daysAfter.filter(({ value }) => value > 0).length / daysAfter.length >
          1 - settings.maxMissingDaysAfter
      )

    const ages = [
      '18-24',
      '25-34',
      '35-44',
      '45-54',
      '55-64',
      '65-74',
      '75-84',
      // '85-94',
      // '95-104',
    ]
    const all = {
      gender: 'Any',
      ageRange: 'Any',
      ...analyse(dataUsers),
    }
    const allGenders = ages.map((age) => ({
      gender: 'Any',
      ageRange: age,
      ...analyse(dataUsers.filter(({ ageRange }) => ageRange === age)),
    }))
    const allMale = {
      gender: 'Male',
      ageRange: 'all',
      ...analyse(dataUsers.filter(({ gender }) => gender === 'Male')),
    }
    const male = ages.map((age) => ({
      gender: 'Male',
      ageRange: age,
      ...analyse(
        dataUsers.filter(
          ({ ageRange, gender }) => ageRange === age && gender === 'Male'
        )
      ),
    }))
    const allFemale = {
      gender: 'Female',
      ageRange: 'all',
      ...analyse(dataUsers.filter(({ gender }) => gender === 'Female')),
    }
    const female = ages.map((age) => ({
      gender: 'Female',
      ageRange: age,
      ...analyse(
        dataUsers.filter(
          ({ ageRange, gender }) => ageRange === age && gender === 'Female'
        )
      ),
    }))

    resolve([
      dataUsers,
      [all, ...allGenders, allMale, ...male, allFemale, ...female],
    ])
  })
}

export { runAnalysis }
