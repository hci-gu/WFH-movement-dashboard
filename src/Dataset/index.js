import React from 'react'
import { useParams } from 'react-router'
import { useAtom } from 'jotai'
import styled from 'styled-components'
import { useDataset } from './api'
import CurrentUser from './components/CurrentUser'
import DayChart from './components/DayChart'
import Filter from './components/Filter'
import SeriesWithCount from './components/SeriesWithCount'
import Settings from './components/Settings'
import { filteredDatasetAtom } from './state'
import BeforeAfterScatter from './components/BeforeAfterScatter'
import EstimationPlot from './components/EstimationPlot'
import WidgetSelect, { widgetAtom } from './components/WidgetSelect'

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: 350px 1fr;
  padding: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  > h1 {
    font-size: 36px;
  }
`

const SidePanel = styled.div`
  margin: 1rem;
  display: flex;
  flex-direction: column;
`

const UserCount = () => {
  const { id } = useParams()
  const [dataset] = useAtom(filteredDatasetAtom)

  return (
    <h1>
      <strong>{id}</strong> - {dataset.rows.length} Users
    </h1>
  )
}

const WidgetSelector = () => {
  const [widget] = useAtom(widgetAtom)

  switch (widget) {
    case 'DayChart':
      return <DayChart />
    case 'EstimationPlot':
      return <EstimationPlot />
    default:
      return null
  }
}

function App() {
  const dataset = useDataset()

  return (
    <Container>
      <SidePanel>
        <UserCount />
        <Settings />
        <Filter dataKey="gender" />
        <br></br>
        <Filter dataKey="ageRange" />
        <br></br>
        <SeriesWithCount />
        <CurrentUser />
      </SidePanel>
      <div>
        <WidgetSelect />
        <WidgetSelector />
        {/* <DayChart />
        <br></br> */}
        {/* <SeriesTotalOverTime />
        <br></br> */}
        {/* <DiffChart /> */}
        {/* <br></br>
        <BeforeAfterScatter />
        <br></br> */}
        <br></br>
        {/* <Occupations /> */}
      </div>
    </Container>
  )
}

export default App
