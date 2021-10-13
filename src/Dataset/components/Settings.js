import { Button, Checkbox, Input } from 'antd'
import { useAtom } from 'jotai'
import React from 'react'
import styled from 'styled-components'
import { settingsAtom } from '../state'

const Container = styled.div`
  margin: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  > div > input {
    margin: 0 0.5rem;
  }
`

const ButtonContainer = styled.div`
  margin: 1rem;

  > span {
    margin: 0 1rem;
  }
`

const Settings = () => {
  const [settings, setSettings] = useAtom(settingsAtom)

  const onChange = (key, value) => {
    console.log(key, value)
    setSettings({
      ...settings,
      [key]: value,
    })
  }

  return (
    <Container>
      <div>
        <span style={{ margin: '0 1rem' }}>Display average</span>
        <Checkbox
          checked={settings.showAverage}
          onChange={() => onChange('showAverage', !settings.showAverage)}
        />
      </div>

      <ButtonContainer>
        <Button
          disabled={settings.showAverage || settings.index === 0}
          onClick={() => onChange('index', settings.index - 1)}
        >
          Prev
        </Button>
        <Input
          value={settings.index}
          onChange={(e) => onChange('index', parseInt(e.target.value))}
          style={{ width: 80 }}
          type="number"
        ></Input>
        <Button
          disabled={settings.showAverage}
          onClick={() => onChange('index', settings.index + 1)}
        >
          Next
        </Button>
      </ButtonContainer>
    </Container>
  )
}

export default Settings
