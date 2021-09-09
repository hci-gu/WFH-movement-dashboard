import React from 'react'
import { Pie } from '@ant-design/charts'
import { useRecoilValue } from 'recoil'
import { dataUsersAtom } from '../../state'
import theme from '../../../shared/theme'

const PieChart = ({ onReady }) => {
  const dataUsers = useRecoilValue(dataUsersAtom)
  const data = dataUsers
    .filter(({ stepsEstimate }) => stepsEstimate !== 0)
    .reduce((acc, { estimatedWrong }) => {
      const key = estimatedWrong.toString()
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
      estimatedWrong: key,
      value: data[key],
    })),
    angleField: 'value',
    colorField: 'estimatedWrong',
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

export default PieChart
