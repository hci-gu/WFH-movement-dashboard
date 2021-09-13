import React, { useState } from 'react'
import { Input, Table, Tag } from 'antd'
import { useRecoilState, useRecoilValue } from 'recoil'
import { dataUsersAtom, usersSelector, userTableFilterAtom } from '../../state'
import User from './User'
import moment from 'moment'
import styled from 'styled-components'

const columns = [
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
    title: 'Created',
    dataIndex: 'created',
    key: 'created',
    sorter: (a, b) => new Date(a.created) - new Date(b.created),
    sortDirections: ['ascend', 'descend'],
    render: (_, u) => <span>{moment(u.created).format('YYYY-MM-DD')}</span>,
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
    title: 'Initial data date',
    dataIndex: 'initialDataDate',
    key: 'initialDataDate',
    sorter: (a, b) => new Date(a.initialDataDate) - new Date(b.initialDataDate),
    sortDirections: ['ascend', 'descend'],
    render: (_, u) => (
      <span>{moment(u.initialDataDate).format('YYYY-MM-DD')}</span>
    ),
  },
  {
    title: 'Days',
    dataIndex: 'days',
    key: 'days',
    sorter: (a, b) => a.days.length - b.days.length,
    sortDirections: ['ascend', 'descend'],
    render: (_, u) => <span>{u.days.length}</span>,
  },
]

const FilterContainer = styled.div`
  display: flex;
  > * {
    margin-right: 10px;
  }
`

const UserTable = ({ useAnalysis }) => {
  const users = useRecoilValue(usersSelector)
  const [userIds, setUserTableFilter] = useRecoilState(userTableFilterAtom)
  const dataUsers = useRecoilValue(dataUsersAtom)
  const [userIdInputValue, setUserIdInputValue] = useState('')

  const dataSource = useAnalysis ? dataUsers : users

  const onRemoveUserIdFilter = (e, idToRemove) => {
    e.preventDefault()
    setUserTableFilter((ids) => ids.filter((id) => id !== idToRemove))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setUserTableFilter((ids) => [...ids, userIdInputValue])
    setUserIdInputValue('')
  }

  return (
    <>
      <FilterContainer>
        <form onSubmit={(e) => onSubmit(e)}>
          <Input
            style={{ width: 450 }}
            placeholder="UserID filter ( does not affect analysis, just to find users )"
            value={userIdInputValue}
            onChange={(e) => setUserIdInputValue(e.target.value)}
          ></Input>
        </form>
        {userIds.map((id) => (
          <Tag
            closable
            onClose={(e) => onRemoveUserIdFilter(e, id)}
            key={id}
            style={{ height: 22 }}
          >
            <span>{id}</span>
          </Tag>
        ))}
      </FilterContainer>
      <Table
        style={{ width: '100%' }}
        dataSource={dataSource
          .filter((u) => userIds.length === 0 || userIds.indexOf(u._id) !== -1)
          .map((u, i) => ({ ...u, key: `Table_user_${i}` }))}
        columns={columns}
        expandable={{
          expandedRowRender: (u) => <User user={u} />,
        }}
      ></Table>
    </>
  )
}

export default UserTable
