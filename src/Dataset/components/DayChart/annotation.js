import ReactDOM from 'react-dom'
import { StepCountForSeries } from '../StepCount'

const annotationForRange = (rows, seriesList, range) => {
  const startOffset = (range[0] / 23) * 100
  const endOffset = ((range[1] + 1) / 23) * 100
  const width = endOffset - startOffset

  return [
    {
      type: 'region',
      start: [`${startOffset}%`, '0%'],
      end: [`${endOffset - 0.5}%`, '100%'],
      top: true,
      style: {
        // fill: '#000',
        stroke: '#000',
        lineWidth: 1,
        lineDash: [8, 7],
        fillOpacity: 0.05,
        opacity: 1,
      },
    },
    {
      type: 'html',
      position: [`${startOffset + 1.75}%`, '90%'],
      html: () => {
        const ele = document.createElement('div')
        ReactDOM.render(
          <StepCountForSeries
            seriesList={seriesList}
            data={rows}
            range={range}
          />,
          ele
        )
        return ele
      },
    },
    {
      type: 'text',
      position: [`${startOffset + width / 2}%`, '5%'],
      content: `${range
        .map(
          (i, index) => `${i <= 9 ? '0' : ''}${i}:${index === 0 ? '00' : '59'}`
        )
        .join(' - ')}`,
      style: {
        fill: '#000',
        fontSize: 24,
        textAlign: 'center',
        textBaseline: 'middle',
      },
    },
  ]
}

export default annotationForRange
