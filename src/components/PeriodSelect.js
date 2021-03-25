import React from 'react'
import styled from 'styled-components'
import { Select } from 'antd'
import moment from 'moment'
import { useRecoilState } from 'recoil'
import { fromDateState } from '../state'

const { Option } = Select

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

const dates = [
  {
    value: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    label: 'Last 30 days',
  },
  {
    value: moment().subtract(90, 'days').format('YYYY-MM-DD'),
    label: 'Last 90 days',
  },
  {
    value: null,
    label: 'Entire period',
  },
]

const PeriodSelect = () => {
  const [date, setDate] = useRecoilState(fromDateState)

  function handleChange(value) {
    console.log(`selected ${value}`)
    setDate(value)
  }

  return (
    <Container>
      <Select
        style={{ width: 150 }}
        onChange={handleChange}
        defaultValue={date}
      >
        {dates.map((d) => (
          <Option value={d.value}>{d.label}</Option>
        ))}
      </Select>
    </Container>
  )
}

export default PeriodSelect
