import React from 'react'
import styled from 'styled-components'
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { useRecoilValue } from 'recoil'
import moment from 'moment'

const Container = styled.div`
  width: 100%;
  height: 100%;
`

const Chart = ({ selector, value, onClick }) => {
  const dates = useRecoilValue(value ? selector(value) : selector).map((d) => ({
    ...d,
    date: moment(d.date).valueOf(),
  }))

  return (
    <Container>
      <ResponsiveContainer>
        <BarChart height={80} data={dates}>
          <XAxis
            // type="number"
            dataKey="date"
            // domain={[moment('2020-10-01').valueOf(), moment().valueOf()]}
            // tick={{ fontSize: 20 }}
            tickFormatter={(tick) => moment(tick).format('YYYY-MM-DD')}
            // ticks={[
            //   moment('2020-10-16').valueOf(),
            //   moment('2020-11-26').valueOf(),
            //   moment('2021-03-01').valueOf(),
            //   moment('2021-08-20').valueOf(),
            // ]}
          />
          <YAxis tick={{ fontSize: 20 }} />
          <Bar
            dataKey="WFH Movement"
            stackId="a"
            fill="#37474F"
            onClick={({ date }) => {
              if (!value) onClick(date)
            }}
          />
          <Bar
            dataKey="SFH Movement"
            stackId="a"
            fill="#78909C"
            onClick={({ date }) => {
              if (!value) onClick(date)
            }}
          />
          <Tooltip />
          {/* <Legend style={{ marginTop: 15 }} /> */}
        </BarChart>
      </ResponsiveContainer>
    </Container>
  )
}

export default Chart
