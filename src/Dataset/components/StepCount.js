import React from 'react'
import styled from 'styled-components'
import { totalSteps, totalStepsForRange } from '../utils'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'

const StepCountContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 18px;

  > div > span {
    margin-right: 1rem;
  }
`

export const StepCountForSeries = ({ data, seriesList, range }) => {
  return (
    <div>
      {seriesList
        .filter((s) => s !== 'before')
        .map((series) => (
          <StepCount
            before={
              range
                ? totalStepsForRange(data, 'before', range)
                : totalSteps(data, 'before')
            }
            after={
              range
                ? totalStepsForRange(data, series, range)
                : totalSteps(data, series)
            }
            name={series}
          />
        ))}
    </div>
  )
}

export const StepCount = ({ before, after, name = 'After' }) => {
  const diff = after - before
  const percent = Math.abs(1 - after / before) * 100
  return (
    <StepCountContainer>
      <div>
        <span style={{ color: '#668FF2' }}>Before: {before}</span>
        <span style={{ color: '#7DD4A9' }}>
          {name}: {after}
        </span>
      </div>
      <strong>
        {diff.toFixed(2)} (
        {diff > 0 ? (
          <CaretUpOutlined style={{ color: 'green' }} />
        ) : (
          <CaretDownOutlined style={{ color: 'red' }} />
        )}
        <span>{percent.toFixed(2)}%)</span>
      </strong>
    </StepCountContainer>
  )
}
