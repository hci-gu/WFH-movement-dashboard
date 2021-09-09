import React from 'react'
import { Area } from '@ant-design/charts'
import { useRecoilValue } from 'recoil'
import { userDatesSelector } from '../../state'
import theme from '../../../shared/theme'

const DatesChart = ({ onReady }) => {
  const data = useRecoilValue(userDatesSelector)
  var config = {
    theme,
    width: 1250,
    height: 200,
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
  }
  console.log(data)
  return <Area {...config} onReady={onReady} />
}

export default DatesChart
