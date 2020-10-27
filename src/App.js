import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { getDashboard } from './api'
import { dashboardState } from './state'

function App() {
  const [dashboard, setDashboard] = useRecoilState(dashboardState)

  useEffect(() => {
    const run = async () => {
      const _dashboard = await getDashboard()

      setDashboard(_dashboard)
    }
    run()
  }, [])

  return (
    <div>
      <pre>{JSON.stringify(dashboard, null, 2)}</pre>
    </div>
  )
}

export default App
