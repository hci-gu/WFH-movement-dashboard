import React, { useState, useEffect } from 'react'
import { Area } from '@ant-design/charts'
import { useRecoilValue } from 'recoil'
import { userDatesSelector } from '../state'

const DatesChart = () => {
  const data = useRecoilValue(userDatesSelector)
  var config = {
    width: 1250,
    height: 200,
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
  }
  console.log(data)
  return <Area {...config} />
}

export default DatesChart
