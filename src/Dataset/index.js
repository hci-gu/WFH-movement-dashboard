import { Button } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import { useAtom } from 'jotai'
import styled from 'styled-components'
import { useDataset } from './api'
import BeforeAfterScatter from './components/BeforeAfterScatter'
import CurrentUser from './components/CurrentUser'
import DayChart from './components/DayChart'
import DiffChart from './components/DiffChart'
import Filter from './components/Filter'
import Occupations from './components/Occupations'
import SeriesTotalOverTime from './components/SeriesTotalOverTime'
import SeriesWithCount from './components/SeriesWithCount'
import Settings from './components/Settings'
import { datasetAverageAtom, filteredDatasetAtom } from './state'

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

const Grid = styled.div`
  display: grid;
`

const UserCount = () => {
  const { id } = useParams()
  const [dataset] = useAtom(filteredDatasetAtom)

  return (
    <h1>
      <strong>{id}</strong> - {dataset.length} Users
    </h1>
  )
}

function App() {
  const dataset = useDataset()
  console.log('dataset', dataset)

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
        <DayChart />
        <br></br>
        {/* <SeriesTotalOverTime />
        <br></br> */}
        {/* <DiffChart /> */}
        <br></br>
        {/* <BeforeAfterScatter />
        <br></br> */}
        {/* <Occupations /> */}
      </div>
    </Container>
  )
}

export default App
