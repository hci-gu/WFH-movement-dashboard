import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import {
  Composition,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  delayRender,
  continueRender,
} from 'remotion'
import { useFixedDataset } from '../src/Dataset/api'
import DayChart from '../src/Dataset/components/DayChart'
import { settingsAtom } from '../src/Dataset/state'

const Test = ({ dataset }) => {
  const frame = useCurrentFrame()
  const videoConfig = useVideoConfig()
  const [settings, setSettings] = useAtom(settingsAtom)

  const opacity = interpolate(frame, [0, videoConfig.fps * 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  useEffect(() => {
    if (frame % 30 === 0) {
      setSettings((s) => ({
        ...s,
        index: s.index + 1,
      }))
    }
  }, [frame])

  return (
    <div style={{ background: 'white', flex: 1 }}>
      <div style={{ opacity }}>
        <h1>{frame}</h1>
        <DayChart />
      </div>
    </div>
  )
}

export const RemotionVideo = () => {
  const [handle] = useState(() => delayRender())

  const dataset = useFixedDataset('before-after-2021-10-12')
  useEffect(() => {
    if (!!dataset.length) {
      continueRender(handle)
    }
  }, [handle, dataset])

  return (
    <>
      <Composition
        id="HelloWorld"
        component={Test}
        durationInFrames={30 * 10}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          dataset,
        }}
      />
    </>
  )
}
