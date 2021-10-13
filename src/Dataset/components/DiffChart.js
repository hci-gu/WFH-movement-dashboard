import React, { useEffect } from 'react'
import { Line, G2 } from '@ant-design/charts'
import { filteredDatasetAtom, settingsAtom } from '../state'
import { useAtom } from 'jotai'

const DiffChart = () => {
  const [rows] = useAtom(filteredDatasetAtom)
  const [settings] = useAtom(settingsAtom)

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
