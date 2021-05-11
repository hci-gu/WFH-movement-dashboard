import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { useUsers } from './api'
import Filter from './components/Filter'
import PeriodInput from './components/PeriodInput'
import { analysisAtom, usersSelector } from './state'

import { runAnalysis } from './dataUtils'
import UserTable from './components/UserTable'
import AnalysisTable from './components/AnalysisTable'

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: 250px 1fr;
  grid-gap: 10px;
  padding: 0 25px;

  > h1 {
    font-size: 36px;
  }
`

const Filters = styled.div`
  width: 250px;
  height: 100%;
  padding: 16px;

  display: flex;
  flex-direction: column;

  > div {
    margin-top: 16px;
  }
`

function App() {
  const allUsers = useUsers()
  const users = useRecoilValue(usersSelector)
  const [loading, setLoading] = useState(false)
  const [, setAnalysis] = useRecoilState(analysisAtom)

  const dataAnalysis = () => {
    if (loading) return
    const run = async () => {
      const analysedRows = await runAnalysis(users)
      setAnalysis(analysedRows)
      setLoading(false)
    }
    setLoading(true)
    run()
  }

  return (
    <Container>
      <Filters>
        <h2>
          {users.length} / {allUsers.length} Users (
          {((users.length / allUsers.length) * 100).toFixed(2)}%)
        </h2>
        <h1>Filters</h1>
        <Filter dataKey="ageRange" />
        <Filter dataKey="gender" />
        <PeriodInput />
      </Filters>
      <div>
        <h1>WFH Movement data {users.length === 0 && '- loading...'}</h1>
        <UserTable />
        <button onClick={dataAnalysis} disabled={users.length === 0}>
          {loading ? 'analyzing..' : 'analyze'}
        </button>
        <AnalysisTable />
      </div>
    </Container>
  )
}

export default App
