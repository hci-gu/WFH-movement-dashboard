import React from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { seriesWithCountAtom } from '../state'
import { colorForIndexAndName } from '../utils'

const Container = styled.div`
  display: flex;
  flex-direction: column;

  > span {
    margin-top: 0.25rem;
  }
`

const SeriesWithCount = () => {
  const data = useRecoilValue(seriesWithCountAtom)

  return (
    <Container>
      {data.map(({ name, count, index, totalSteps }) => {
        const color = colorForIndexAndName(index, name)
        return (
          <span>
            <strong style={{ color }}>{name}</strong> {count}
          </span>
        )
      })}
    </Container>
  )
}

export default SeriesWithCount
