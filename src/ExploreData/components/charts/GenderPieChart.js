import React from 'react'
import { Pie } from '@ant-design/charts'
import theme from '../../../shared/theme'

const GenderPieChart = ({ users, onReady }) => {
  const data = users
    .filter((u) => !!u.gender)
    .reduce((acc, { gender }) => {
      const key = gender.toLowerCase()
      if (acc[key]) {
        acc[key]++
      } else {
        acc[key] = 1
      }
      return acc
    }, {})

  var config = {
    theme,
    appendPadding: 10,
    radius: 0.9,
    data: Object.keys(data).map((key) => ({
      gender: key,
      value: data[key],
    })),
    angleField: 'value',
    colorField: 'gender',
    label: {
      type: 'inner',
      offset: '-30%',
      content: (_ref) => {
        var percent = _ref.percent.toFixed(3)
        return ''.concat(percent * 100, '%')
      },
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
  }
  return <Pie {...config} onReady={onReady} />
}

export default GenderPieChart
