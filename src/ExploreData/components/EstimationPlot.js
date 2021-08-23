import React from 'react'
import { Scatter } from '@ant-design/charts'
import { useRecoilState, useRecoilValue } from 'recoil'
import { dataUsersAtom, userTableFilterAtom } from '../state'

const EstimationPlot = () => {
  const dataUsers = useRecoilValue(dataUsersAtom)
  const [, setUserTableFilter] = useRecoilState(userTableFilterAtom)

  var config = {
    width: 1250,
    height: 800,
    data: dataUsers
      .filter(({ stepsDifference }) => stepsDifference < 2)
      .filter(({ stepsEstimate }) => stepsEstimate !== 0)
      .map((u) => ({ ...u, change: u.change })),
    xField: 'stepsEstimate',
    yField: 'change',
    shape: 'circle',
    colorField: 'ageRange',
    size: 4,
    quadrant: {
      xBaseline: 0,
      yBaseline: 0,
    },
    onEvent: (_, event) => {
      if (event.type === 'click') {
        const user = event.data.data
        setUserTableFilter((ids) => [...ids, user._id])
      }
    },
  }
  return <Scatter {...config} />
}

export default EstimationPlot
