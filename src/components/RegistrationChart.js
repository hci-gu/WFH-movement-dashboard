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
import { usersByDay } from '../state'

const Container = styled.div`
  width: 100%;
  height: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const RegistrationChart = () => {
  const dates = useRecoilValue(usersByDay)

  return (
    <Container>
      <h2>Users over time</h2>
      <ResponsiveContainer>
        <BarChart height={80} data={dates}>
          <Bar dataKey="users">
            {dates.map((_, index) => (
              <Cell fill="#5B6D78" key={`cell-${index}`} />
            ))}
          </Bar>
          <XAxis dataKey="date" />
          <YAxis dataKey="users" />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  )
}

export default RegistrationChart
