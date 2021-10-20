import React from 'react'
import { Table } from 'antd'
import { Bar } from '@ant-design/charts'
import { useRecoilValue } from 'recoil'
import { analysisAtom } from '../state'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'

// const FacetChart = ({ analysis }) => {
//   var config = {
//     type: 'mirror',
//     data: analysis.filter((r) => r.gender !== 'Any').reverse(),
//     fields: ['gender'],
//     transpose: true,
//     padding: [32, 16, 28, 16],
//     meta: {
//       age: {
//         sync: true,
//         tickCount: 11,
//       },
//       total_percentage: {
//         sync: true,
//         formatter: function formatter(v) {
//           return v + '%'
//         },
//       },
//       gender: { sync: true },
//     },
//     axes: {},
//     eachView: function eachView(view, f) {
//       return {
//         padding: [0, 48, 0, 0],
//         type: 'column',
//         options: {
//           data: f.data,
//           xField: 'ageRange',
//           yField: 'percentChange',
//           seriesField: 'gender',
//           color: ['#f04864', '#1890ff'],
//         },
//       }
//     },
//   }
//   return <Facet {...config} />
// }

const BarChart = ({ analysis }) => {
  const config = {
    data: analysis.filter((r) => r.gender !== 'Any'),
    isGroup: true,
    xField: 'percentChange',
    yField: 'ageRange',
    seriesField: 'gender',
    dodgePadding: 4,
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
    color: ['#f04864', '#1890ff'],
  }
  return <Bar {...config} />
}

const columns = [
  {
    title: 'Gender',
    dataIndex: 'gender',
  },
  {
    title: 'Age range',
    dataIndex: 'ageRange',
  },
  {
    title: 'p',
    dataIndex: 'p',
    render: (_, v) => <span>{v.p.toFixed(4)}</span>,
  },
  // {
  //   title: 'testValue',
  //   dataIndex: 'testValue',
  //   render: (_, v) => <span>{v.testValue.toFixed(4)}</span>,
  // },
  // {
  //   title: 'Valid',
  //   dataIndex: 'valid',
  //   render: (_, v) => <span>{v.valid ? 'True' : 'False'}</span>,
  // },
  {
    title: 'n',
    dataIndex: 'freedom',
  },
  // {
  //   title: 'Steps Before',
  //   dataIndex: 'before',
  //   render: (_, v) => <span>{parseInt(v.before)}</span>,
  // },
  // {
  //   title: 'Steps After',
  //   dataIndex: 'after',
  //   render: (_, v) => <span>{parseInt(v.after)}</span>,
  // },
  {
    title: 'Diff',
    dataIndex: 'diff',
    render: (_, v) => {
      const diff = v.after - v.before
      const percent = Math.abs(1 - v.after / v.before) * 100
      return (
        <span>
          {diff.toFixed(2)} (
          {diff > 0 ? (
            <CaretUpOutlined style={{ color: 'green' }} />
          ) : (
            <CaretDownOutlined style={{ color: 'red' }} />
          )}
          <span>{percent.toFixed(2)}%)</span>
        </span>
      )
    },
  },
]

const AnalysisTable = () => {
  const analysis = useRecoilValue(analysisAtom)

  return (
    <>
      <Table
        style={{ width: '40%' }}
        pagination={{ pageSize: analysis.length }}
        size="small"
        dataSource={analysis.map((row, i) => ({ ...row, key: `Row_${i}` }))}
        columns={columns}
        onRow={(v) => ({ style: { fontWeight: v.valid ? 400 : 700 } })}
      ></Table>
      <BarChart analysis={analysis} />
    </>
  )
}

export default AnalysisTable
