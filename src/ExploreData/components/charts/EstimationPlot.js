import React from 'react'
import { Scatter } from '@ant-design/charts'
import { useRecoilState, useRecoilValue } from 'recoil'
import { dataUsersAtom, userTableFilterAtom } from '../../state'
import theme from '../../../shared/theme'

function roundToPointFive(num) {
  return parseFloat((Math.ceil(num * 20 - 0.5) / 20).toFixed(2))
}

const annotationStyle = {
  textAlign: 'center',
  fontWeight: '800',
  fontSize: 28,
  fill: 'rgba(92, 92, 92, 0.8)',
}

const percentUsersForQuadrant = (users, xtest, ytest) => {
  const usersNot0 = users.filter((u) => u.stepsEstimate !== 0 && u.change !== 0)
  const percent =
    usersNot0.filter(({ stepsEstimate, change }) => {
      return xtest(stepsEstimate) && ytest(change)
    }).length / usersNot0.length
  return (percent * 100).toFixed(2) + '%'
}

const EstimationPlot = ({ onReady }) => {
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
    theme,
    appendPadding: 40,
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
      regionStyle: [
        { fill: '#fff' },
        { fill: '#fff' },
        { fill: '#fff' },
        { fill: '#fff' },
      ],
    },
    xAxis: {
      label: false,
    },
    yAxis: {
      label: false,
    },
    regressionLine: {
      type: 'linear',
      top: true,
      style: {
        stroke: '#C62828',
      },
      // algorithm: (users) => {
      //   const values = users.map((u) => [u.stepsEstimate, u.change])
      //   const result = findLineByLeastSquares(values)
      //   console.log(result)
      //   return result.values
      // },
    },
    pointStyle: {
      fillOpacity: 1,
      fill: '#37474F',
    },
    annotations: [
      // {
      //   type: 'text',
      //   position: ['-0.5', '-0.5'],
      //   content: `${percentUsersForQuadrant(
      //     dataUsers,
      //     (x) => x < 0,
      //     (y) => y < 0
      //   )}`,
      //   style: annotationStyle,
      // },
      // {
      //   type: 'text',
      //   position: ['0.5', '-0.5'],
      //   content: `${percentUsersForQuadrant(
      //     dataUsers,
      //     (x) => x > 0,
      //     (y) => y < 0
      //   )}`,
      //   style: annotationStyle,
      // },
      // {
      //   type: 'text',
      //   position: ['-0.5', '0.5'],
      //   content: `${percentUsersForQuadrant(
      //     dataUsers,
      //     (x) => x < 0,
      //     (y) => y > 0
      //   )}`,
      //   style: annotationStyle,
      // },
      // {
      //   type: 'text',
      //   position: ['0.5', '0.5'],
      //   content: `${percentUsersForQuadrant(
      //     dataUsers,
      //     (x) => x > 0,
      //     (y) => y > 0
      //   )}`,
      //   style: annotationStyle,
      // },
      {
        type: 'text',
        position: ['-0.5', '-1.05'],
        content: `Moved less`,
        style: {
          textAlign: 'center',
          fontWeight: '800',
          fontSize: 14,
          fill: 'rgba(92, 92, 92, 0.8)',
        },
      },
      {
        type: 'text',
        position: ['0.5', '-1.05'],
        content: `Moved more`,
        style: {
          textAlign: 'center',
          fontWeight: '800',
          fontSize: 14,
          fill: 'rgba(92, 92, 92, 0.8)',
        },
      },
      {
        type: 'text',
        position: ['-1.05', '-0.5'],
        content: `Estimated less`,
        rotate: -Math.PI / 2,
        style: {
          textAlign: 'center',
          fontWeight: '800',
          fontSize: 14,
          fill: 'rgba(92, 92, 92, 0.8)',
        },
      },
      {
        type: 'text',
        position: ['-1.05', '0.5'],
        content: `Estimated more`,
        rotate: -Math.PI / 2,
        style: {
          textAlign: 'center',
          fontWeight: '800',
          fontSize: 14,
          fill: 'rgba(92, 92, 92, 0.8)',
        },
      },
    ],
  }
  return <Scatter {...config} onReady={onReady} />
}

export default EstimationPlot
