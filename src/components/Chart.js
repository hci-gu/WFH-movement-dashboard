import React from 'react'
import styled from 'styled-components'
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { useRecoilValue } from 'recoil'

const Container = styled.div`
  width: 100%;
  height: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Chart = ({ selector, value, onClick }) => {
  const dates = useRecoilValue(value ? selector(value) : selector)

  return (
    <ResponsiveContainer>
      <BarChart height={80} data={dates}>
        <Bar
          dataKey="users"
          onClick={({ date }) => {
            if (!value) onClick(date)
          }}
        >
          {dates.map((_, index) => (
            <Cell fill="#5B6D78" key={`cell-${index}`} />
          ))}
        </Bar>
        <XAxis dataKey="date" />
        <YAxis dataKey="users" />
        <Tooltip />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Chart
