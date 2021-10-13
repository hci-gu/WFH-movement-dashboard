import { useAtom } from 'jotai'
import React from 'react'
import { currentUserSelectorAtom } from '../state'

const CurrentUser = () => {
  const [user] = useAtom(currentUserSelectorAtom)

  if (!user) return null

  return <pre>{JSON.stringify(user, null, 2)}</pre>
}

export default CurrentUser
