import { useAtom } from 'jotai'
import React from 'react'
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
  const [data] = useAtom(seriesWithCountAtom)

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
