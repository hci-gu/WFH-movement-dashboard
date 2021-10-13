import { Line } from '@ant-design/charts'
import { useAtom } from 'jotai'
import React from 'react'
import { seriesWithCountAtom } from '../state'

const SeriesTotalOverTime = () => {
  const [data] = useAtom(seriesWithCountAtom)

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
