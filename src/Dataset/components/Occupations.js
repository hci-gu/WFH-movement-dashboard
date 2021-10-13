import { WordCloud } from '@ant-design/charts'
import { useAtom } from 'jotai'
import React from 'react'
import { occupationsSelectorAtom } from '../state'

const Occupations = () => {
  const [rows] = useAtom(occupationsSelectorAtom)

  const config = {
    data: rows,
    wordField: 'name',
    weightField: 'value',
    colorField: 'value',
    wordStyle: {
      fontFamily: 'Verdana',
      fontSize: [14, 80],
    },
    interactions: [{ type: 'element-active' }],
    state: { active: { style: { lineWidth: 3 } } },
  }
  return <WordCloud {...config} />
}

export default Occupations
