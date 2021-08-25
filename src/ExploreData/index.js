import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Button } from 'antd'
import styled from 'styled-components'
import { useUsers } from './api'
import Filter from './components/Filter'
import PeriodInput from './components/PeriodInput'
import {
  analysisAtom,
  analysisSettingsAtom,
  dataUsersAtom,
  usersSelector,
  widgetAtom,
} from './state'

import { runAnalysis } from './dataUtils'
import UserTable from './components/UserTable'
import AnalysisTable from './components/AnalysisTable'
import AnalysisSettings from './components/AnalysisSettings'
import WidgetSelect from './components/WidgetSelect'
import AmountHeader from './components/AmountHeader'

import AgeGroups from './components/charts/AgeGroups'
import EstimationPlot from './components/charts/EstimationPlot'
import EstimationPieChart from './components/charts/EstimationPieChart'
import WFHDays from './components/charts/WFHDays'
import GenderPieChart from './components/charts/GenderPieChart'

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

const TitleAndSelect = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;

  > h1 {
    width: 100%;
    margin: 0;
  }
`

function WidgetSelector({ dataUsers, allUsers }) {
  const [activeWidget] = useRecoilState(widgetAtom)

  switch (activeWidget) {
    case 'AnalysisTable':
      return <AnalysisTable />
    case 'UserTable':
      return <UserTable useAnalysis={dataUsers.length > 0} />
    case 'WFHDays':
      return <WFHDays />
    case 'EstimationPieChart':
      return <EstimationPieChart />
    case 'GenderPieChart':
      return (
        <GenderPieChart users={dataUsers.length > 0 ? dataUsers : allUsers} />
      )
    case 'EstimationPlot':
      return <EstimationPlot />
    case 'AgeGroups':
      return <AgeGroups users={dataUsers.length > 0 ? dataUsers : allUsers} />
    default:
      return null
  }
}

function App() {
  const allUsers = useUsers()
  const [dataUsers, setDataUsers] = useRecoilState(dataUsersAtom)
  const users = useRecoilValue(usersSelector)
  const [loading, setLoading] = useState(false)
  const analysisSettings = useRecoilValue(analysisSettingsAtom)
  const [, setAnalysis] = useRecoilState(analysisAtom)

  const dataAnalysis = () => {
    if (loading) return
    const run = async () => {
      const [dataUsers, analysedRows] = await runAnalysis(
        users,
        analysisSettings
      )
      setAnalysis(analysedRows)
      setDataUsers(dataUsers)
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
        <Filter dataKey="country" />
        <Filter dataKey="appName" />
        <PeriodInput />

        <AnalysisSettings />
        <Button
          onClick={dataAnalysis}
          disabled={users.length === 0}
          style={{ marginTop: 10 }}
        >
          {loading ? 'analyzing..' : 'analyze'}
        </Button>
      </Filters>
      <div>
        <TitleAndSelect>
          <AmountHeader dataUsers={dataUsers} allUsers={allUsers} />
          <WidgetSelect />
        </TitleAndSelect>
        <WidgetSelector dataUsers={dataUsers} allUsers={allUsers} />
      </div>
    </Container>
  )
}

export default App
