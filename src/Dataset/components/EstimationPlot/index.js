import React, { useRef } from 'react'
import distinctColors from 'distinct-colors'

import { Scatter } from '@ant-design/charts'

import {
  filteredDatasetAtom,
  medianEstimatesAtom,
  medianEstimationAtom,
} from '../../state'
import theme from '../../../shared/theme'
import { useAtom } from 'jotai'
import { Button } from 'antd'

const annotationStyle = {
  textAlign: 'center',
  fontWeight: '800',
  fontSize: 28,
  fill: 'rgba(92, 92, 92, 0.8)',
}

function roundToPointFive(num) {
  return parseFloat((Math.ceil(num * 20 - 0.5) / 20).toFixed(2))
}

const percentUsersForQuadrant = (users, xtest, ytest) => {
  const usersNot0 = users.filter((u) => u.stepsEstimate !== 0 && u.diff !== 0)
  const percent =
    usersNot0.filter(({ stepsEstimate, diff }) => {
      return xtest(stepsEstimate) && ytest(diff)
    }).length / usersNot0.length
  return (percent * 100).toFixed(2) + '%'
}

const EstimationPlot = () => {
  const ref = useRef()
  const [medians] = useAtom(medianEstimatesAtom)
  const [dataset] = useAtom(filteredDatasetAtom)
  console.log(medians)

  const filteredUsers = dataset.rows
    .filter(
      ({ diff, stepsEstimate }) =>
        diff !== undefined && stepsEstimate !== undefined
    )
    .filter(({ diff }) => diff < 2)
    .filter(({ stepsEstimate }) => stepsEstimate !== 0)

  const keys = {}
  filteredUsers.forEach((u) => {
    const key = `c-${roundToPointFive(u.diff)}_e-${roundToPointFive(
      u.stepsEstimate
    )}`
    if (keys[key]) keys[key].count++
    else {
      keys[key] = {
        change: roundToPointFive(u.diff),
        stepsEstimate: roundToPointFive(u.stepsEstimate),
        count: 1,
      }
    }
  })
  const data = Object.keys(keys).map((key) => {
    return keys[key]
  })

  console.log(distinctColors().map((c) => c.toString()))

  const config = {
    theme,
    appendPadding: 40,
    width: 1250,
    height: 800,
    data: [
      ...data.map((d) => ({ ...d, type: 'single' })),
      ...medians.map(({ name, stepsEstimate, change, count }) => ({
        stepsEstimate,
        change,
        count,
        type: name,
      })),
    ],
    xField: 'stepsEstimate',
    yField: 'change',
    shape: 'circle',
    sizeField: 'count',
    colorField: 'type',
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
      min: -1,
      max: 2,
    },
    yAxis: {
      label: false,
      min: -1,
      max: 2,
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
    color: [
      'rgba(55, 71, 79, 0.2)',
      ...distinctColors({ count: medians.length + 1 }).map((c) => c.toString()),
    ],
    // pointStyle: {
    //   fillOpacity: 0.2,
    //   fill: '#37474F',
    // },
    annotations: [
      {
        type: 'text',
        position: ['-0.5', '-0.5'],
        content: `${percentUsersForQuadrant(
          filteredUsers,
          (x) => x < 0,
          (y) => y < 0
        )}`,
        style: annotationStyle,
      },
      {
        type: 'text',
        position: ['0.5', '-0.5'],
        content: `${percentUsersForQuadrant(
          filteredUsers,
          (x) => x > 0,
          (y) => y < 0
        )}`,
        style: annotationStyle,
      },
      {
        type: 'text',
        position: ['-0.5', '0.5'],
        content: `${percentUsersForQuadrant(
          filteredUsers,
          (x) => x < 0,
          (y) => y > 0
        )}`,
        style: annotationStyle,
      },
      {
        type: 'text',
        position: ['0.5', '0.5'],
        content: `${percentUsersForQuadrant(
          filteredUsers,
          (x) => x > 0,
          (y) => y > 0
        )}`,
        style: annotationStyle,
      },
      {
        type: 'text',
        position: ['-0.5', '-1.05'],
        content: `Estimated less`,
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
        content: `Estimated more`,
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
        content: `Moved less`,
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
        content: `Moved more`,
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

  return (
    <>
      <Button onClick={() => ref.current.downloadImage('chart', 'image/png')}>
        Download image
      </Button>
      <Scatter
        {...config}
        onReady={(plot) => {
          ref.current = plot
        }}
      />
    </>
  )
}

export default EstimationPlot
