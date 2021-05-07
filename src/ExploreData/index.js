import { Table } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { useUsers } from './api'
import DatesChart from './components/DatesChart'
import Filter from './components/Filter'
import PeriodInput from './components/PeriodInput'
import User from './components/User'
import { usersSelector } from './state'

import { createBeforeAndAfterDays, analyse } from './dataUtils'

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
  // {
  //   title: 'ID',
  //   dataIndex: '_id',
  //   key: '_id',
  //   render: (_, u) => (
  //     <a href={`http://localhost:8081/db/coronamovement/users/"${u._id}"`}>
  //       ..{u._id.substring(u._id.length - 4, u._id.length)}
  //     </a>
  //   ),
  // },
  // {
  //   title: 'Created',
  //   dataIndex: 'created',
  //   key: 'created',
  //   sorter: (a, b) => new Date(a.created) - new Date(b.created),
  //   sortDirections: ['ascend', 'descend'],
  //   render: (_, u) => <span>{moment(u.created).format('YYYY-MM-DD')}</span>,
  // },
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
  // {
  //   title: 'Steps change',
  //   dataIndex: 'stepsChange',
  //   key: 'stepsChange',
  //   sorter: (a, b) => a.stepsChange - b.stepsChange,
  //   sortDirections: ['ascend', 'descend'],
  //   render: (_, u) => <span>{(u.stepsChange * 100).toFixed(1)} %</span>,
  // },
  // {
  //   title: 'Steps before',
  //   dataIndex: 'stepsBefore',
  //   key: 'stepsBefore',
  //   sorter: (a, b) => a.stepsBefore - b.stepsBefore,
  //   sortDirections: ['ascend', 'descend'],
  // },
  // {
  //   title: 'StepsAfter',
  //   dataIndex: 'stepsAfter',
  //   key: 'stepsAfter',
  //   sorter: (a, b) => a.stepsAfter - b.stepsAfter,
  //   sortDirections: ['ascend', 'descend'],
  // },
  // {
  //   title: 'Total steps',
  //   dataIndex: 'totalSteps',
  //   key: 'totalSteps',
  //   sorter: (a, b) => a.totalSteps - b.totalSteps,
  //   sortDirections: ['ascend', 'descend'],
  //   render: (_, u) => <span>{parseInt(u.totalSteps)}</span>,
  // },
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
    title: 'Compare date',
    dataIndex: 'compareDate',
    key: 'compareDate',
    sorter: (a, b) => new Date(a.compareDate) - new Date(b.compareDate),
    sortDirections: ['ascend', 'descend'],
    render: (_, u) => <span>{moment(u.compareDate).format('YYYY-MM-DD')}</span>,
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

  const [analysis, setAnalysis] = useState({})

  // const median = arr => arr.sort()[Math.floor(arr.length/2)]

  // const analyse = (users) => {
  //   const corpus = users //.filter(({ ageRange }) => ageRange === '25-34')
  //   // console.log({ corpus })
  //   const medians = corpus
  //     .filter(({ compareDate }) => compareDate)
  //     .filter(({ days }) => !!days && days.length > 0)
  //     .map(({ days, compareDate }) => {
  //       const daysBefore = days
  //         .filter(({ date }) => new Date(date) < new Date(compareDate) && moment(date).isAfter(moment(compareDate).subtract(3, 'months')))
  //       const daysAfter = days
  //         .filter(({ date }) => new Date(date) >= new Date(compareDate) && moment(date).isBefore(moment(compareDate).add(3, 'months')))

  //       return [daysBefore, daysAfter]
  //     })
  //     .filter(([daysBefore, daysAfter]) => daysBefore.filter(({ value }) => value > 0).length / daysBefore.length > 0.05)
  //     .filter(([daysBefore, daysAfter]) => daysAfter.filter(({ value }) => value > 0).length / daysAfter.length > 0.05)
  //     .map(([daysBefore, daysAfter]) => {
  //       return [
  //         median(daysBefore.map(({ value }) => value)),
  //         median(daysAfter.map(({ value }) => value)),
  //         // daysBefore.reduce((sum, { value }) => sum + value, 0) / daysBefore.length,
  //         // daysAfter.reduce((sum, { value }) => sum + value, 0) / daysAfter.length,
  //       ]
  //     })
  //     .filter(([a, b]) => !Number.isNaN(a) && !Number.isNaN(b) && a !== undefined && b !== undefined)
  //     console.log({ medians })
  //     const diffs = medians.map(([ before, after ]) => (after || 0) - before)
  //     // const avgDiff = diffs.reduce((sum, diff) => sum + diff, 0) / medians.length
  //     // const sdDiff = Math.sqrt(diffs.reduce((sum, diff) => sum + (diff - avgDiff) * (diff - avgDiff), 0) / (medians.length))
  //     // const t = avgDiff / (sdDiff/Math.sqrt(medians.length))
  //     // console.log({ avgDiff, sdDiff, t })

  //     // const test = ttest(medians.map(([x]) => x), medians.map(([,x]) => x))
  //     const test = ttest(diffs)
  //     console.log({ p: test.pValue(), testValue: test.testValue(), valid: test.valid(), freedom: test.freedom()}) // , conf: test.confidence()})

  //     return {
  //       // avgDiff, sdDiff, t,
  //       p: test.pValue(),
  //       testValue: test.testValue(),
  //       valid: test.valid(),
  //       freedom: test.freedom(),
  //       before: medians.reduce((sum, [diff, _]) => sum + diff, 0) / medians.length,
  //       after: medians.reduce((sum, [_, diff]) => sum + diff, 0) / medians.length
  //     }
  // }

  // useEffect(() => {
  //   if (users.length == 0) return

  //   setAnalysis(analyse(users))
  // }, [users])

  const dataAnalysis = () => {
    const ages = [
      '18-24',
      '25-34',
      '35-44',
      '45-54',
      '55-64',
      '65-74',
      '75-84',
      // '85-94',
      // '95-104',
    ]

    const dataUsers = createBeforeAndAfterDays(users.filter(({ compareDate, days }) => compareDate && days && days.length > 0))
      .filter(({daysBefore, daysAfter}) => daysBefore.filter(({ value }) => value > 0).length / daysBefore.length > 0.05)
      .filter(({daysBefore, daysAfter}) => daysAfter.filter(({ value }) => value > 0).length / daysAfter.length > 0.05)

    const all = {
      gender: 'Any',
      ageRange: 'all',
      ...analyse(dataUsers)
    }
    const allGenders = ages.map(age => (
      {
        gender: 'Any',
        ageRange: age,
        ...analyse(dataUsers.filter(({ ageRange }) => ageRange === age))
      }
    ))
    const allMale = {
      gender: 'Male',
      ageRange: 'all',
      ...analyse(dataUsers.filter(({ gender }) => gender === 'Male'))
    }
    const male = ages.map(age => (
      {
        gender: 'Male',
        ageRange: age,
        ...analyse(dataUsers.filter(({ ageRange, gender }) => ageRange === age && gender === 'Male'))
      }
    ))
    const allFemale = {
      gender: 'Female',
      ageRange: 'all',
      ...analyse(dataUsers.filter(({ gender }) => gender === 'Female'))
    }
    const female = ages.map(age => (
      {
        gender: 'Female',
        ageRange: age,
        ...analyse(dataUsers.filter(({ ageRange, gender }) => ageRange === age && gender === 'Female'))
      }
    ))

    console.table([
      all,
      ...allGenders,
      allMale,
      ...male,
      allFemale,
      ...female
    ])
  }

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
      { JSON.stringify(analysis) }
      <button onClick={dataAnalysis}>Do data stuff</button>
      {/* <Table
        dataSource={users.map((u, i) => ({ ...u, key: i }))}
        columns={columns}
        expandable={{
          expandedRowRender: (u) => <User user={u} />,
          // rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
      ></Table> */}
    </Container>
  )
}

export default App
