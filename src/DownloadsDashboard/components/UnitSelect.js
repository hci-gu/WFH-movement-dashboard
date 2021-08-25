import React from 'react'
import styled from 'styled-components'
import { Select } from 'antd'
import { useRecoilState } from 'recoil'
import { unitState } from '../state'

const { Option } = Select

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

const units = [
  {
    value: 'day',
    label: 'Day',
  },
  {
    value: 'week',
    label: 'Week',
  },
  {
    value: 'month',
    label: 'Month',
  },
]

const UnitSelect = () => {
  const [unit, setUnit] = useRecoilState(unitState)

  return (
    <Container>
      <Select
        style={{ width: 150 }}
        onChange={(value) => setUnit(value)}
        defaultValue={unit}
      >
        {units.map((d) => (
          <Option value={d.value}>{d.label}</Option>
        ))}
      </Select>
    </Container>
  )
}

export default UnitSelect
