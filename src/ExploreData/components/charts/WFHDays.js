import React from 'react'
import { Column } from '@ant-design/charts'
import moment from 'moment'
import { useRecoilValue } from 'recoil'
import { dataUsersAtom } from '../../state'

const startDate = moment('2020-01-01')
const endDate = moment('2020-10-16')

const usersWithWFHDayForDate = (users, date) => {
  return users.reduce((count, user) => {
    if (date >= new Date(user.compareDate)) {
      count++
    }
    return count
  }, 0)
}

const daysForPeriod = (users) => {
  const days = moment(endDate).diff(startDate, 'days')
  return Array.from({ length: days })
    .map((_, i) => i)
    .reduce((acc, i) => {
      const date = moment(startDate).add(i, 'days').format('YYYY-MM-DD')
      acc[date] = usersWithWFHDayForDate(users, new Date(date))
      return acc
    }, {})
}

const WFHDays = () => {
  const dataUsers = useRecoilValue(dataUsersAtom)
  const days = daysForPeriod(dataUsers)

  const config = {
    data: Object.keys(days).map((key) => ({ date: key, value: days[key] })),
    xField: 'date',
    yField: 'value',
  }

  return <Column {...config} />
}

export default WFHDays
