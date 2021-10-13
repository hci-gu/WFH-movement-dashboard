import { Select } from 'antd'
import { useAtom } from 'jotai'
import React from 'react'
import { filtersAtom } from '../state'

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
    default:
      return []
  }
}

const Filter = ({ dataKey }) => {
  const [filters, setFilters] = useAtom(filtersAtom)

  const onChange = (value) => {
    setFilters({
      ...filters,
      [dataKey]: value,
    })
  }

  return (
    <>
      <Select
        onChange={onChange}
        mode="multiple"
        allowClear
        placeholder={`Select ${dataKey}`}
      >
        {optionsForKey(dataKey).map((value) => (
          <Select.Option value={value} key={`Filter_${dataKey}_${value}`}>
            {value}
          </Select.Option>
        ))}
      </Select>
    </>
  )
}

export default Filter
