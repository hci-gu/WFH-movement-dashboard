import { Select } from 'antd'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { filtersAtom, userCountriesSelector } from '../state'

const optionsForKey = (key) => {
  switch (key) {
    case 'ageRange':
      return [
        '18-24',
        '25-34',
        '35-44',
        '45-54',
        '55-64',
        '65-74',
        '75-84',
        '85-94',
        '95-104',
      ]
    case 'gender':
      return ['Male', 'Female']
    case 'appName':
      return ['WFH Movement', 'SFH Movement']
    default:
      return []
  }
}

const Filter = ({ dataKey }) => {
  const [filters, setFilters] = useRecoilState(filtersAtom)
  const countryList = useRecoilValue(userCountriesSelector)

  const onChange = (value) => {
    setFilters({
      ...filters,
      [dataKey]: value,
    })
  }

  const options = dataKey === 'country' ? countryList : optionsForKey(dataKey)

  return (
    <Select onChange={onChange} placeholder={`Select ${dataKey}`}>
      <Select.Option value={null}>All</Select.Option>
      {options.map((value) => (
        <Select.Option value={value} key={`Filter_${dataKey}_${value}`}>
          {value}
        </Select.Option>
      ))}
    </Select>
  )
}

export default Filter
