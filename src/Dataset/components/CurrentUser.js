import React from 'react'
import { useRecoilValue } from 'recoil'
import { currentUserSelectorAtom } from '../state'

const CurrentUser = () => {
  const user = useRecoilValue(currentUserSelectorAtom)

  if (!user) return null

  return <pre>{JSON.stringify(user, null, 2)}</pre>
}

export default CurrentUser
