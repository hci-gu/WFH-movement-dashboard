import React from 'react'
import { Column } from '@ant-design/charts'
import moment from 'moment'
import theme from '../../../shared/theme'

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

const WFHDays = ({ users, onReady }) => {
  const days = daysForPeriod(users)

  const config = {
    theme,
    appendPadding: 25,
    data: Object.keys(days).map((key) => ({ date: key, value: days[key] })),
    xField: 'date',
    yField: 'value',
    xAxis: { tickCount: 5 },
    color: '#5D879C',
  }

  return <Column {...config} onReady={onReady} />
}

export default WFHDays
