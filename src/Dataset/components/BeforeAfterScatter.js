import React, { useRef } from 'react'

import { Mix, G2 } from '@ant-design/charts'

import { filteredDatasetAtom } from '../state'
import { useAtom } from 'jotai'

const BeforeAfterScatter = () => {
  const ref = useRef()
  const [data] = useAtom(filteredDatasetAtom)

  G2.registerInteraction('other-visible', {
    showEnable: [
      {
        trigger: 'plot:mouseenter',
        action: 'cursor:crosshair',
      },
      {
        trigger: 'mask:mouseenter',
        action: 'cursor:move',
      },
      {
        trigger: 'plot:mouseleave',
        action: 'cursor:default',
      },
      {
        trigger: 'mask:mouseleave',
        action: 'cursor:crosshair',
      },
    ],
    start: [
      {
        trigger: 'plot:mousedown',
        isEnable: function isEnable(context) {
          console.log(ref.current)
          setTimeout(() => {
            console.log(ref.current.chart.views[0])
            ref.current.chart.views.forEach((view, i) => {
              console.log(`view:${i}`, view.filterData(view.getData()))
            })
          }, 100)
          return !context.isInShape('mask')
        },
        action: ['rect-mask:start', 'rect-mask:show'],
      },
      {
        trigger: 'mask:dragstart',
        action: 'rect-mask:moveStart',
      },
    ],
    processing: [
      {
        trigger: 'plot:mousemove',
        action: 'rect-mask:resize',
      },
      {
        trigger: 'mask:drag',
        isEnable: function isEnable(context) {
          return context.isInPlot()
        },
        action: 'rect-mask:move',
      },
      {
        trigger: 'mask:change',
        action: 'element-sibling-filter-record:filter',
      },
    ],
    end: [
      {
        trigger: 'plot:mouseup',
        action: 'rect-mask:end',
      },
      {
        trigger: 'mask:dragend',
        action: 'rect-mask:moveEnd',
      },
      {
        trigger: 'mask:dragend',
        action: (a, b, c) => {
          console.log('mask:dragend', a, b, c)
        },
      },
    ],
    rollback: [
      {
        trigger: 'dblclick',
        action: ['rect-mask:hide', 'element-sibling-filter-record:reset'],
      },
    ],
  })

  var config = {
    tooltip: false,
    views: [
      {
        region: {
          start: {
            x: 0,
            y: 0,
          },
          end: {
            x: 0.5,
            y: 1,
          },
        },
        padding: [10, 20, 40, 50],
        data,
        axes: {},
        geometries: [
          {
            type: 'point',
            xField: 'before',
            yField: 'after',
            mapping: {},
          },
        ],
        interactions: [{ type: 'other-visible' }],
      },
      {
        region: {
          start: {
            x: 0.5,
            y: 0,
          },
          end: {
            x: 1,
            y: 1,
          },
        },
        padding: [10, 20, 40, 50],
        data,
        axes: {
          x: {
            min: 0,
            tickCount: 5,
          },
        },
        geometries: [
          {
            type: 'point',
            xField: 'before',
            yField: 'after',
            mapping: { shape: 'circle' },
          },
        ],
      },
    ],
  }

  return (
    <Mix
      {...config}
      onReady={(chart) => {
        ref.current = chart
        chart.on('data-filter', () => {
          console.log('element - sibling - filter')
        })
      }}
    />
  )
}

export default BeforeAfterScatter
