import React, { useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Button } from 'antd'
import styled from 'styled-components'
import { useUsers } from './api'
import { dataUsersAtom, usersSelector, widgetAtom } from './state'

import UserTable from './components/UserTable'
import AnalysisTable from './components/AnalysisTable'
import WidgetSelect from './components/WidgetSelect'
import AmountHeader from './components/AmountHeader'

import AgeGroups from './components/charts/AgeGroups'
import EstimationPlot from './components/charts/EstimationPlot'
import EstimationPieChart from './components/charts/EstimationPieChart'
import WFHDays from './components/charts/WFHDays'
import GenderPieChart from './components/charts/GenderPieChart'
import SettingsPanel from './components/SettingsPanel'

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

function WidgetSelector({ dataUsers, allUsers, users }) {
  const [activeWidget] = useRecoilState(widgetAtom)
  const ref = useRef()

  const onReady = (plot) => {
    ref.current = plot
  }

  const downloadImage = () => {
    ref.current.downloadImage()
  }

  let component
  switch (activeWidget) {
    case 'AnalysisTable':
      return <AnalysisTable />
    case 'UserTable':
      return <UserTable useAnalysis={dataUsers.length > 0} />
    case 'WFHDays':
      component = (
        <WFHDays
          users={dataUsers.length > 0 ? dataUsers : users}
          onReady={onReady}
        />
      )
      break
    case 'EstimationPieChart':
      component = <EstimationPieChart onReady={onReady} />
      break
    case 'GenderPieChart':
      component = (
        <GenderPieChart
          users={dataUsers.length > 0 ? dataUsers : allUsers}
          onReady={onReady}
        />
      )
      break
    case 'EstimationPlot':
      component = <EstimationPlot onReady={onReady} />
      break
    case 'AgeGroups':
      component = (
        <AgeGroups
          users={dataUsers.length > 0 ? dataUsers : allUsers}
          onReady={onReady}
        />
      )
      break
    default:
      return null
  }

  return (
    <>
      <Button onClick={downloadImage}>export</Button>
      {component}
    </>
  )
}

function App() {
  const allUsers = useUsers()
  const dataUsers = useRecoilValue(dataUsersAtom)
  const users = useRecoilValue(usersSelector)

  return (
    <Container>
      <SettingsPanel />
      <div>
        <TitleAndSelect>
          <AmountHeader dataUsers={dataUsers} allUsers={allUsers} />
          <WidgetSelect />
        </TitleAndSelect>
        <WidgetSelector
          dataUsers={dataUsers}
          allUsers={allUsers}
          users={users}
        />
      </div>
    </Container>
  )
}

export default App
