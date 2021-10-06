import styled from 'styled-components'
import React from 'react'
import { Line } from '@ant-design/charts'

const Container = styled.div`
  display: flex;
`

const User = ({ user }) => {
  console.log(user)
  var config = {
    height: 450,
    data: user.days,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    connectNulls: false,
    smooth: false,
    lineStyle: (d) => {
      return {
        opacity: d.type === 'all' ? 0.25 : 1.0,
      }
    },
  }
  if (user.daysBefore) {
    config.data = [
      ...user.days.map((d) => ({ ...d, type: 'all' })),
      ...user.daysBefore.map((d) => ({ ...d, type: 'before' })),
      ...user.daysAfter.map((d) => ({ ...d, type: 'after' })),
    ]
  }

  return (
    <Container>
      <pre>
        {JSON.stringify(
          {
            ...user,
            days: undefined,
            daysBefore: undefined,
            daysAfter: undefined,
          },
          null,
          2
        )}
      </pre>
      <Line {...config} style={{ flex: 1 }} />
    </Container>
  )
}

export default User
