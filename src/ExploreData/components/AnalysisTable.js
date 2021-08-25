import React from 'react'
import { Table } from 'antd'
import { useRecoilValue } from 'recoil'
import { analysisAtom } from '../state'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'

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
    title: 'Freedom',
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
    <Table
      pagination={{ pageSize: analysis.length }}
      size="small"
      dataSource={analysis.map((row, i) => ({ ...row, key: `Row_${i}` }))}
      columns={columns}
      onRow={(v) => ({ style: { fontWeight: v.valid ? 400 : 700 } })}
    ></Table>
  )
}

export default AnalysisTable
