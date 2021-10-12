import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { Bar, Line } from '@ant-design/charts'
import { useRecoilValue } from 'recoil'
import { rowSelectorAtom, seriesInDatasetAtom, SETTINGS } from '../state'
import { StepCount, StepCountForSeries } from './StepCount'
import { colorForSeries, totalSteps } from '../utils'
import { Button } from 'antd'
import { useRef } from 'react'
import theme from '../../shared/theme'
import ColumnChart from '@ant-design/charts/es/plots/column'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > span {
    margin: 0.5rem;
    font-size: 24px;
  }
`

const annotationForRange = (rows, seriesList, range) => {
  const startOffset = (range[0] / 23) * 100
  const endOffset = (range[1] / 23) * 100
  const width = endOffset - startOffset

  return [
    {
      type: 'region',
      start: [`${startOffset}%`, '0%'],
      end: [`${endOffset}%`, '100%'],
      top: true,
      style: {
        // fill: '#000',
        stroke: '#000',
        lineWidth: 1,
        lineDash: [8, 7],
        fillOpacity: 0.05,
        opacity: 1,
      },
    },
    {
      type: 'html',
      position: [`${startOffset + 1.75}%`, '90%'],
      html: () => {
        const ele = document.createElement('div')
        ReactDOM.render(
          <StepCountForSeries
            seriesList={seriesList}
            data={rows}
            range={range}
          />,
          ele
        )
        return ele
      },
    },
    {
      type: 'text',
      position: [`${startOffset + width / 2}%`, '5%'],
      content: `${range.map((i) => `${i <= 9 ? '0' : ''}${i}:00`).join(' - ')}`,
      style: {
        fill: '#000',
        fontSize: 24,
        textAlign: 'center',
        textBaseline: 'middle',
      },
    },
  ]
}

const DayChart = () => {
  const ref = useRef()
  const data = useRecoilValue(rowSelectorAtom)
  const seriesList = useRecoilValue(seriesInDatasetAtom)
  console.log('DayChart', data)

  const config = {
    data: [...data]
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour))
      .map((d) => ({ ...d, hour: `${d.hour}:00` })),
    height: 800,
    padding: 'auto',
    xField: 'hour',
    yField: 'diff',
    seriesField: 'series',
    color: ({ series }) => {
      if (series === 'before') {
        return 'rgba(50, 50, 180, 1)'
      }
      if (series === 'after') {
        return 'rgba(225, 50, 50, 1)'
      }

      return colorForSeries(series, seriesList)
    },
    smooth: true,
    isStack: true,
    // isGroup: true,
    annotations: [
      // ...annotationForRange(data, [0, 11]),
      // ...annotationForRange(data, [12, 24]),
      // ...annotationForRange(data, seriesList, [6, 10]),
      // ...annotationForRange(data, seriesList, [11, 15]),
      // ...annotationForRange(data, seriesList, [16, 20]),
    ],
  }

  return (
    <Container>
      <Button onClick={() => ref.current.downloadImage('chart', 'image/png')}>
        Download
      </Button>
      {SETTINGS.displayStepCount && (
        <StepCount
          before={totalSteps(data, 'before')}
          after={totalSteps(data, 'after')}
        />
      )}
      <ColumnChart
        {...config}
        theme={theme}
        background="orange"
        style={{ width: '100%', backgroundColor: 'white' }}
        onReady={(plot) => {
          ref.current = plot
        }}
      />
    </Container>
  )
}

export default DayChart
