import React from 'react'
import styled from 'styled-components'
import { Select } from 'antd'
import { atom, useAtom } from 'jotai'

const availableWidgets = ['DayChart', 'EstimationPlot']
export const widgetAtom = atom(availableWidgets[0])

const { Option } = Select

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

const WidgetSelect = () => {
  const [widget, setWidget] = useAtom(widgetAtom)

  return (
    <Container>
      <Select
        style={{ width: 150 }}
        onChange={(value) => setWidget(value)}
        defaultValue={widget}
      >
        {availableWidgets.map((name) => (
          <Option value={name}>{name}</Option>
        ))}
      </Select>
    </Container>
  )
}

export default WidgetSelect
