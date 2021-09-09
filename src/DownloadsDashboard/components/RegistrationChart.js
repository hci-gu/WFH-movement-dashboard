import React, { useState } from 'react'
import styled from 'styled-components'
import Chart from './Chart'
import { usersByWeek, usersForDay } from '../state'

const Container = styled.div`
  width: 100%;
  height: 700px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Title = styled.div`
  display: flex;
  align-items: center;

  > button {
    border: 1px solid black;
    background-color: white;
    border-radius: 4px;
    padding: 4px 6px;
    text-align: center;
    text-decoration: none;
    display: inline-block;

    margin-left: 10px;
  }
`

const RegistrationChart = () => {
  const [day, setDay] = useState(null)

  return (
    <Container>
      <Title>
        {day ? <h2>Users for {day}</h2> : <h2>Users over time</h2>}
        {day && <button onClick={() => setDay(null)}>╳</button>}
      </Title>
      <Chart
        selector={day ? usersForDay : usersByWeek}
        value={day}
        onClick={(date) => setDay(date)}
      />
    </Container>
  )
}

export default RegistrationChart
