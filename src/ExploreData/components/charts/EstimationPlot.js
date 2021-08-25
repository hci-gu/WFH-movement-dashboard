import React from 'react'
import { Scatter } from '@ant-design/charts'
import { useRecoilState, useRecoilValue } from 'recoil'
import { dataUsersAtom, userTableFilterAtom } from '../../state'

function roundToPointFive(num) {
  return parseFloat((Math.ceil(num * 20 - 0.5) / 20).toFixed(2))
}

const EstimationPlot = () => {
  const dataUsers = useRecoilValue(dataUsersAtom)
  const [, setUserTableFilter] = useRecoilState(userTableFilterAtom)

  const filteredUsers = dataUsers
    .filter(
      ({ stepsDifference, stepsEstimate }) =>
        stepsDifference !== undefined && stepsEstimate !== undefined
    )
    .filter(({ stepsDifference }) => stepsDifference < 2)
    // .filter(({ stepsEstimate }) => stepsEstimate <= 1)
    .filter(({ stepsEstimate }) => stepsEstimate !== 0)

  const keys = {}
  filteredUsers.forEach((u) => {
    const key = `c-${roundToPointFive(u.change)}_e-${roundToPointFive(
      u.stepsEstimate
    )}`
    if (keys[key]) keys[key].count++
    else {
      keys[key] = {
        change: roundToPointFive(u.change),
        stepsEstimate: roundToPointFive(u.stepsEstimate),
        count: 1,
      }
    }
  })
  const data = Object.keys(keys).map((key) => {
    return keys[key]
  })

  var config = {
    width: 1250,
    height: 800,
    data,
    xField: 'stepsEstimate',
    yField: 'change',
    shape: 'circle',
    sizeField: 'count',
    size: [2, 15],
    quadrant: {
      xBaseline: 0,
      yBaseline: 0,
    },
    regressionLine: {
      type: 'linear',
      // top: true,
      // algorithm: (users) => {
      //   const values = users.map((u) => [u.stepsEstimate, u.change])
      //   const result = findLineByLeastSquares(values)
      //   console.log(result)
      //   return result.values
      // },
    },
    onEvent: (data, event) => {
      // if (event.type === 'click') {
      //   const user = event.data.data
      //   setUserTableFilter((ids) => [...ids, user._id])
      // }
    },
  }
  return <Scatter {...config} />
}

export default EstimationPlot
