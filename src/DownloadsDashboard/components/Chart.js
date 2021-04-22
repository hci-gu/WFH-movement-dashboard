import React from 'react'
import styled from 'styled-components'
import {
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { useRecoilValue } from 'recoil'

const Container = styled.div`
  width: 100%;
  height: 100%;
`

const Chart = ({ selector, value, onClick }) => {
  const dates = useRecoilValue(value ? selector(value) : selector)

  return (
    <Container>
      <ResponsiveContainer>
        <BarChart height={80} data={dates}>
          <XAxis dataKey="date" />
          <YAxis />
          <Bar
            dataKey="WFH Movement"
            stackId="a"
            fill="#8884d8"
            onClick={({ date }) => {
              if (!value) onClick(date)
            }}
          />
          <Bar
            dataKey="SFH Movement"
            stackId="a"
            fill="#82ca9d"
            onClick={({ date }) => {
              if (!value) onClick(date)
            }}
          />
          <Tooltip />
          <Legend style={{ marginTop: 15 }} />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  )
}

export default Chart
