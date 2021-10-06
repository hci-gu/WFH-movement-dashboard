import React, { useEffect } from 'react'
// import styled from 'styled-components'
import { Line, G2 } from '@ant-design/charts'
import { useRecoilValue } from 'recoil'
import { filteredDatasetAtom, settingsAtom } from '../state'

const DiffChart = () => {
  const rows = useRecoilValue(filteredDatasetAtom)
  const settings = useRecoilValue(settingsAtom)

  useEffect(() => {
    G2.registerShape('point', 'index-point', {
      draw: function draw(cfg, container) {
        const group = container.addGroup()
        group.addShape('circle', {
          attrs: {
            x: cfg.x,
            y: cfg.y,
            r: 5,
            fill: 'red',
          },
        })
        return group
      },
    })
    G2.registerShape('point', 'none', {
      draw: function draw(_, container) {
        return container.addGroup()
      },
    })
  }, [])

  const config = {
    data: rows.map((d, i) => ({
      ...d,
      index: i,
    })),
    height: 200,
    padding: 'auto',
    xField: 'index',
    yField: 'diff',
    point: {
      shape: (x) => {
        return x.index === settings.index ? 'index-point' : 'none'
      },
    },
    // seriesField: 'index',
    // color: ({ index }) => {
    //   if (index === settings.index) {
    //     return 'red'
    //   }
    //   return 'blue'
    // },
  }

  return (
    <div>
      <Line {...config} />
    </div>
  )
}

export default DiffChart
