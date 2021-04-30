import { Table } from 'antd'
import moment from 'moment'
import React from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { useUsers } from './api'
import DatesChart from './components/DatesChart'
import Filter from './components/Filter'
import PeriodInput from './components/PeriodInput'
import User from './components/User'
import { usersSelector } from './state'

const Container = styled.div`
  margin: 0 auto;
  width: 85%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;

  > h1 {
    font-size: 36px;
  }
`

const Filters = styled.div`
  position: fixed;
  left: 0;

  width: 250px;
  height: 100%;
  padding: 16px;

  display: flex;
  flex-direction: column;

  > div {
    margin-top: 16px;
  }
`

const columns = [
  {
    title: 'ID',
    dataIndex: '_id',
    key: '_id',
    render: (_, u) => (
      <a href={`http://localhost:8081/db/coronamovement/users/"${u._id}"`}>
        ..{u._id.substring(u._id.length - 4, u._id.length)}
      </a>
    ),
  },
  {
    title: 'Created',
    dataIndex: 'created',
    key: 'created',
    sorter: (a, b) => new Date(a.created) - new Date(b.created),
    sortDirections: ['ascend', 'descend'],
    render: (_, u) => <span>{moment(u.created).format('YYYY-MM-DD')}</span>,
  },
  {
    title: 'Age range',
    dataIndex: 'ageRange',
    key: 'ageRange',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: 'Steps change',
    dataIndex: 'stepsChange',
    key: 'stepsChange',
    sorter: (a, b) => a.stepsChange - b.stepsChange,
    sortDirections: ['ascend', 'descend'],
    render: (_, u) => <span>{(u.stepsChange * 100).toFixed(1)} %</span>,
  },
  {
    title: 'Steps before',
    dataIndex: 'stepsBefore',
    key: 'stepsBefore',
    sorter: (a, b) => a.stepsBefore - b.stepsBefore,
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'StepsAfter',
    dataIndex: 'stepsAfter',
    key: 'stepsAfter',
    sorter: (a, b) => a.stepsAfter - b.stepsAfter,
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Total steps',
    dataIndex: 'totalSteps',
    key: 'totalSteps',
    sorter: (a, b) => a.totalSteps - b.totalSteps,
    sortDirections: ['ascend', 'descend'],
    render: (_, u) => <span>{parseInt(u.totalSteps)}</span>,
  },
  {
    title: 'Days with data',
    dataIndex: 'daysWithData',
    key: 'daysWithData',
    sorter: (a, b) => a.daysWithData - b.daysWithData,
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Data Period',
    dataIndex: 'period',
    key: 'period',
    sorter: (a, b) => a.period - b.period,
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Missing days',
    dataIndex: 'missingDays',
    key: 'missingDays',
    sorter: (a, b) => a.missingDays - b.missingDays,
    sortDirections: ['ascend', 'descend'],
    render: (_, u) => {
      const percentMissing = ((u.missingDays / u.period) * 100).toFixed(1)
      return (
        <span style={{ color: percentMissing > 5 ? 'red' : 'black' }}>
          {u.missingDays} ({percentMissing} %)
        </span>
      )
    },
  },
  {
    title: 'WFH periods',
    dataIndex: 'wfhPeriods',
    key: 'wfhPeriods',
    sorter: (a, b) => a.wfhPeriods - b.wfhPeriods,
    sortDirections: ['ascend', 'descend'],
  },
]

function App() {
  const allUsers = useUsers()
  const users = useRecoilValue(usersSelector)

  return (
    <Container>
      <h1>WFH Movement data</h1>
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
      {users.length === 0 && 'loading...'}
      <DatesChart />
      <Table
        dataSource={users.map((u, i) => ({ ...u, key: i }))}
        columns={columns}
        expandable={{
          expandedRowRender: (u) => <User user={u} />,
          // rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
      ></Table>
    </Container>
  )
}

export default App
