import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  margin: 0 auto;
  width: 80%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;

  > h1 {
    font-size: 36px;
  }
`

function App() {
  return (
    <Container>
      <h1>WFH Movement data</h1>
    </Container>
  )
}

export default App
