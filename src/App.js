import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useRecoilState } from 'recoil'
import { getDashboard } from './api'
import { dashboardState } from './state'

import Number from './components/Number'

const Container = styled.div`
  margin: 0 auto;
  width: 80%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;

  > h1 {
    font-size: 36px;
  }
`

const Grid = styled.div`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-gap: 15px;
`

function App() {
  const [dashboard, setDashboard] = useRecoilState(dashboardState)

  useEffect(() => {
    const run = async () => {
      const _dashboard = await getDashboard()

      setDashboard(_dashboard)
    }
    run()
  }, [])

  return (
    <Container>
      <h1>WFH Movement stats</h1>
      <Grid>
        <Number selector="users" title="Users" />
        <Number selector="usersLastSevenDays" title="Users (last 7 days)" />
        <Number selector="usersToday" title="Users (today)" />
        <Number selector="sessions" title="Sessions" />
        <Number
          selector="sessionsLastSevenDays"
          title="Sessions (last 7 days)"
        />
        <Number selector="sessionsToday" title="Sessions (today)" />
      </Grid>
    </Container>
  )
}

export default App
