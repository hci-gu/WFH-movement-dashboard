import React from 'react'
import styled from 'styled-components'
import { Line } from '@ant-design/charts'
import { rowSelectorAtom, seriesInDatasetAtom, SETTINGS } from '../../state'
import { StepCount } from '../StepCount'
import {
  colorForSeries,
  downloadWithSplitSeries,
  totalSteps,
} from '../../utils'
import { Button } from 'antd'
import { useRef } from 'react'
import theme from '../../../shared/theme'
import { useAtom } from 'jotai'

const color = (series, seriesList) => {
  if (series === 'before') {
    return 'rgba(50, 50, 180, 1)'
  }
  if (series === 'after') {
    return 'rgba(225, 50, 50, 1)'
  }

  return colorForSeries(series, seriesList)
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > span {
    margin: 0.5rem;
    font-size: 24px;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  > button {
    margin-right: 1rem;
  }
`

// const ColumnChart = ({ baseConfig, seriesList }) => {
//   const config = {
//     ...baseConfig,
//     xField: 'hour',
//     yField: 'value',
//     seriesField: 'series',
//     isGroup: true,
//     color: ({ series }) => color(series, seriesList),
//   }

//   return <Column {...config} />
// }

// const BoxChart = ({ baseConfig, parentRef }) => {
//   const config = {
//     ...baseConfig,
//     groupField: 'series',
//     xField: 'hour',
//     yField: ['q10', 'q25', 'median', 'q75', 'q90'],
//     // boxStyle: {
//     //   stroke: '#545454',
//     //   fill: ['#1890FF', '#ffa'],
//     //   fillOpacity: 0.3,
//     // },
//   }

//   return (
//     <Box
//       {...config}
//       theme={theme}
//       style={{ width: '100%', backgroundColor: 'white' }}
//       onReady={(plot) => {
//         parentRef.current = plot
//       }}
//     />
//   )
// }

const LineChart = ({ baseConfig, seriesList, parentRef }) => {
  const config = {
    ...baseConfig,
    xField: 'hour',
    yField: 'median',
    seriesField: 'series',
    smooth: true,
    color: ({ series }) => color(series, seriesList),
  }
  return (
    <Line
      {...config}
      animation={false}
      theme={theme}
      style={{ width: '100%', backgroundColor: 'white' }}
      onReady={(plot) => {
        parentRef.current = plot
      }}
    />
  )
}

const DayChart = ({ passedRef }) => {
  const ref = useRef()
  const [dataset] = useAtom(rowSelectorAtom)
  const [seriesList] = useAtom(seriesInDatasetAtom)

  const data = [...dataset.rows]
    .sort((a, b) => parseInt(a.hour) - parseInt(b.hour))
    // .filter((d) => {
    //   if (!!settings.seriesIndex) {
    //     return d.series === seriesList[settings.seriesIndex].name
    //   }
    //   return true
    // })
    .map((d) => ({ ...d, hour: `${d.hour}:00` }))

  const config = {
    data,
    height: 720,
    padding: 'auto',
    annotations: [
      // ...annotationForRange(data, seriesList, [6, 10]),
      // ...annotationForRange(data, seriesList, [11, 15]),
      // ...annotationForRange(data, seriesList, [16, 20]),
    ],
  }

  return (
    <Container>
      <ButtonContainer>
        <Button onClick={() => ref.current.downloadImage('chart', 'image/png')}>
          Download image
        </Button>
        <Button onClick={() => downloadWithSplitSeries(data, seriesList)}>
          Download json
        </Button>
      </ButtonContainer>
      <span>
        p: {dataset && dataset.test ? dataset.test.p.toFixed(2) : '-'}
      </span>
      {SETTINGS.displayStepCount && (
        <StepCount
          before={totalSteps(data, 'before')}
          after={totalSteps(data, 'after')}
        />
      )}
      <LineChart
        baseConfig={config}
        seriesList={seriesList}
        parentRef={passedRef ? passedRef : ref}
      />
      {/* <BoxChart baseConfig={config} seriesList={seriesList} parentRef={ref} /> */}
      {/* <ColumnChart
        baseConfig={config}
        seriesList={seriesList}
        parentRef={ref}
      /> */}
    </Container>
  )
}

export default DayChart
