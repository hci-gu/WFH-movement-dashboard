import React from 'react'
import { Bar } from '@ant-design/charts'
import theme from '../../../shared/theme'

const ageRangeForUser = (ageRange) => {
  if (ageRange.toLowerCase().indexOf('prefer') !== -1) {
    return 'Prefer not to say'
  }
  return ageRange
}

const AgeGroups = ({ users, onReady }) => {
  const ageRangesAndGender = users
    .filter((u) => !!u.ageRange)
    .reduce((map, user) => {
      const ageRange = ageRangeForUser(user.ageRange)

      if (!map[ageRange]) {
        map[ageRange] = {
          [user.gender]: 1,
        }
      } else {
        if (!map[ageRange][user.gender]) {
          map[ageRange][user.gender] = 1
        } else {
          map[ageRange][user.gender]++
        }
      }

      return map
    }, {})

  const data = Object.keys(ageRangesAndGender)
    .map((ageRange) =>
      Object.keys(ageRangesAndGender[ageRange]).map((gender) => ({
        ageRange,
        gender,
        value: ageRangesAndGender[ageRange][gender],
      }))
    )
    .flat()

  const config = {
    theme,
    data: data.sort((a, b) =>
      a.ageRange.localeCompare(b.ageRange, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    ),
    isStack: true,
    xField: 'value',
    yField: 'ageRange',
    seriesField: 'gender',
    color: ['#F9A825', '#9C794E', '#37474F', '#9AC5DB'],
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
  }

  return <Bar {...config} onReady={onReady} />
}

export default AgeGroups
