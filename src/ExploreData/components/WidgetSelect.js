import React from 'react'
import styled from 'styled-components'
import { Select } from 'antd'
import { useRecoilState } from 'recoil'
import { widgetAtom } from '../state'

const { Option } = Select

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

const availableWidgets = [
  'AnalysisTable',
  'UserTable',
  'WFHDays',
  'GenderPieChart',
  'EstimationPieChart',
  'EstimationPlot',
  'AgeGroups',
]

const WidgetSelect = () => {
  const [widget, setWidget] = useRecoilState(widgetAtom)

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
