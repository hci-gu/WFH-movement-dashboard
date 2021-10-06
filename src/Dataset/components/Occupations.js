import { WordCloud } from '@ant-design/charts'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { filteredDatasetAtom, occupationsSelectorAtom } from '../state'

const Occupations = () => {
  const rows = useRecoilValue(occupationsSelectorAtom)

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
