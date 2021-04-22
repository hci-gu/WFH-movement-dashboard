import React from 'react'
import styled from 'styled-components'
import { animated, useSpring } from 'react-spring'
import { useRecoilValue } from 'recoil'
import { dashBoardValue, dashBoardValueForApp } from '../state'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > h1,
  h2 {
    margin: 0;
    padding: 0;
    font-size: 2.5vw;
  }

  > h2 {
    font-weight: lighter;
  }
`

const AppValues = styled.div`
  display: flex;
`
const AppValue = styled.span`
  margin: 0 10px;
`

const numberFormatter = new Intl.NumberFormat('sv-SE')

const Number = ({ title, selector }) => {
  const value = useRecoilValue(dashBoardValue(selector))
  const wfhValue = useRecoilValue(
    dashBoardValueForApp({ app: 'WFH Movement', key: selector })
  )
  const sfhValue = useRecoilValue(
    dashBoardValueForApp({ app: 'SFH Movement', key: selector })
  )
  const displayValue = useSpring({ value })

  return (
    <Container>
      <h1>{title}</h1>
      <animated.h2>
        {displayValue.value.interpolate((x) =>
          numberFormatter.format(parseInt(x))
        )}
      </animated.h2>
      <AppValues>
        <AppValue style={{ color: '#8884d8' }}>( {wfhValue} )</AppValue>
        <AppValue style={{ color: '#82ca9d' }}>( {sfhValue} )</AppValue>
      </AppValues>
    </Container>
  )
}

export default Number
