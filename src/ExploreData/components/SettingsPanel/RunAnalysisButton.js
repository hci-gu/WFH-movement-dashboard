import { Button } from 'antd'
import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { runAnalysis } from '../../dataUtils'
import {
  analysisAtom,
  analysisSettingsAtom,
  dataUsersAtom,
  usersSelector,
} from '../../state'

const RunAnalysisButton = () => {
  const users = useRecoilValue(usersSelector)
  const [, setDataUsers] = useRecoilState(dataUsersAtom)
  const [loading, setLoading] = useState(false)
  const analysisSettings = useRecoilValue(analysisSettingsAtom)
  const [, setAnalysis] = useRecoilState(analysisAtom)

  const dataAnalysis = () => {
    if (loading) return
    const run = async () => {
      const [dataUsers, analysedRows] = await runAnalysis(
        users,
        analysisSettings
      )
      setAnalysis(analysedRows)
      setDataUsers(dataUsers)
      setLoading(false)
    }
    setLoading(true)
    run()
  }

  return (
    <Button
      onClick={dataAnalysis}
      disabled={users.length === 0}
      style={{ marginTop: 10 }}
    >
      {loading ? 'analyzing..' : 'analyze'}
    </Button>
  )
}

export default RunAnalysisButton
