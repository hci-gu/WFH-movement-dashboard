import React from 'react'
import styled from 'styled-components'
import { animated, useSpring } from 'react-spring'
import { useRecoilValue } from 'recoil'
import { dashBoardValue } from '../state'

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

const numberFormatter = new Intl.NumberFormat('sv-SE')

const Number = ({ title, selector }) => {
  const value = useRecoilValue(dashBoardValue(selector))
  const displayValue = useSpring({ value })

  return (
    <Container>
      <h1>{title}</h1>
      <animated.h2>
        {displayValue.value.interpolate((x) =>
          numberFormatter.format(parseInt(x))
        )}
      </animated.h2>
    </Container>
  )
}

export default Number
