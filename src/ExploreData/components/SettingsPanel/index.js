import React from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { useUsers } from '../../api'
import { usersSelector } from '../../state'
import AnalysisSettings from './AnalysisSettings'
import Filter from './Filter'
import PeriodInput from './PeriodInput'
import RunAnalysisButton from './RunAnalysisButton'

const Container = styled.div`
  width: 250px;
  height: 100%;
  padding: 16px;

  display: flex;
  flex-direction: column;

  > div {
    margin-top: 16px;
  }
`

const SettingsPanel = () => {
  const allUsers = useUsers()
  const users = useRecoilValue(usersSelector)

  return (
    <Container>
      <h2>
        {users.length} / {allUsers.length} Users (
        {((users.length / allUsers.length) * 100).toFixed(2)}%)
      </h2>
      <h1>Filters</h1>
      <Filter dataKey="ageRange" />
      <Filter dataKey="gender" />
      <Filter dataKey="country" />
      <Filter dataKey="appName" />
      <Filter dataKey="education" />
      <PeriodInput />

      <AnalysisSettings />
      <RunAnalysisButton />
    </Container>
  )
}

export default SettingsPanel
