import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useRecoilState } from 'recoil'
import { getDashboard, getUserRegistrations } from './api'
import { dashboardState, userRegistrationsState } from './state'

import Number from './components/Number'
import RegistrationChart from './components/RegistrationChart'
import PeriodSelect from './components/PeriodSelect'
import UnitSelect from './components/UnitSelect'

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

const SelectContainer = styled.div`
  display: flex;
  align-self: flex-end;

  > * {
    margin-left: 10px;
  }
`

function App() {
  const [, setDashboard] = useRecoilState(dashboardState)
  const [, setUserRegistrations] = useRecoilState(userRegistrationsState)

  useEffect(() => {
    const run = async () => {
      const _dashboard = await getDashboard()
      const _dates = await getUserRegistrations()

      setDashboard(_dashboard)
      setUserRegistrations(_dates)
    }
    run()
  }, [setDashboard, setUserRegistrations])

  return (
    <Container>
      <h1>WFH Movement stats</h1>
      <SelectContainer>
        <PeriodSelect />
        <UnitSelect />
      </SelectContainer>
      <RegistrationChart />
      <Grid>
        <Number selector="users" title="Users" />
        <Number selector="usersLastSevenDays" title="Users (last 7 days)" />
        <Number selector="usersToday" title="Users (today)" />
      </Grid>
    </Container>
  )
}

export default App
