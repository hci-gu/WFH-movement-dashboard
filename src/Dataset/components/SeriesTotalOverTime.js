import { Line } from '@ant-design/charts'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { seriesWithCountAtom } from '../state'

const SeriesTotalOverTime = () => {
  const data = useRecoilValue(seriesWithCountAtom)

  const config = {
    data,
    xField: 'name',
    yField: 'totalSteps',
    // seriesField: 'name',
    yAxis: {
      min: 3500,
      max: 6500,
    },
  }
  return <Line {...config} />
}

export default SeriesTotalOverTime
