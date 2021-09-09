import ttest from 'ttest'
import AnalysisWorker from './analysis.worker.js'
import Papa from 'papaparse'

export const downloadAsCsv = (rows, columns) => {
  let filename = 'export.csv'

  let csv = Papa.unparse({ data: rows, fields: columns, dynamicTyping: true })
  if (csv == null) return

  var blob = new Blob([csv])
  if (window.navigator.msSaveOrOpenBlob)
    // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
    window.navigator.msSaveBlob(blob, filename)
  else {
    var a = window.document.createElement('a')
    a.href = window.URL.createObjectURL(blob, { type: 'text/plain' })
    a.download = filename
    document.body.appendChild(a)
    a.click() // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    document.body.removeChild(a)
  }
}

export const downloadJson = (data) => {
  let filename = 'export.json'

  var blob = new Blob([JSON.stringify(data)])
  if (window.navigator.msSaveOrOpenBlob)
    window.navigator.msSaveBlob(blob, filename)
  else {
    var a = window.document.createElement('a')
    a.href = window.URL.createObjectURL(blob, { type: 'text/plain' })
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

// values|result [[x,y]...]
export function findLineByLeastSquares(values) {
  let sum_x = 0
  let sum_y = 0
  let sum_xy = 0
  let sum_xx = 0
  let count = 0

  for (let v = 0; v < values.length; v++) {
    let x = values[v][0]
    let y = values[v][1]
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
    let x = values[v][0]
    let y = x * m + b
    result.push([x, y])
  }

  return {
    slope: m,
    values: result,
  }
}

const mean = (arr) =>
  arr.length === 0 ? 0 : arr.reduce((sum, value) => sum + value, 0) / arr.length

const analyse = (users, useFixed = false) => {
  const beforeAfter = useFixed
    ? users.map(({ stepsBeforeFixed, stepsAfterFixed }) => {
        return [stepsBeforeFixed, stepsAfterFixed]
      })
    : users.map(({ stepsBefore, stepsAfter }) => {
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

  const before = mean(beforeAfter.map(([x]) => x))
  const after = mean(beforeAfter.map(([, x]) => x))
  const percentChange = -((1 - after / before) * 100)

  return {
    // avgDiff, sdDiff, t,
    p: test.pValue(),
    testValue: test.testValue(),
    valid: test.valid(),
    freedom: test.freedom(),
    before,
    after,
    percentChange: Number(Math.round(percentChange + 'e1') + 'e-1'),
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
    let dataUsers = processedChunks
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
    if (settings.fixedWFHDate) {
      dataUsers = dataUsers
        .filter(
          ({ daysBeforeFixed, daysAfter }) =>
            daysBeforeFixed.filter(({ value }) => value > 0).length /
              daysBeforeFixed.length >
            1 - settings.maxMissingDaysBefore
        )
        .filter(
          ({ daysBeforeFixed, daysAfterFixed }) =>
            daysAfterFixed.filter(({ value }) => value > 0).length /
              daysAfterFixed.length >
            1 - settings.maxMissingDaysBefore
        )
    }

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
      ...analyse(dataUsers, !!settings.fixedWFHDate),
    }
    // const allGenders = ages.map((age) => ({
    //   gender: 'Any',
    //   ageRange: age,
    //   ...analyse(dataUsers.filter(({ ageRange }) => ageRange === age)),
    // }))
    const allMale = {
      gender: 'Male',
      ageRange: 'all',
      ...analyse(
        dataUsers.filter(({ gender }) => gender === 'Male'),
        !!settings.fixedWFHDate
      ),
    }
    // const male = ages.map((age) => ({
    //   gender: 'Male',
    //   ageRange: age,
    //   ...analyse(
    //     dataUsers.filter(
    //       ({ ageRange, gender }) => ageRange === age && gender === 'Male'
    //     )
    //   ),
    // }))
    const allFemale = {
      gender: 'Female',
      ageRange: 'all',
      ...analyse(
        dataUsers.filter(({ gender }) => gender === 'Female'),
        !!settings.fixedWFHDate
      ),
    }
    // const female = ages.map((age) => ({
    //   gender: 'Female',
    //   ageRange: age,
    //   ...analyse(
    //     dataUsers.filter(
    //       ({ ageRange, gender }) => ageRange === age && gender === 'Female'
    //     )
    //   ),
    // }))

    resolve([dataUsers, [all, allMale, allFemale]])
  })
}

export { runAnalysis }
