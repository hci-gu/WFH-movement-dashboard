import React from 'react'

const totalStepsForUsers = (users) => {
  return users
    .reduce((total, user) => {
      return total + parseInt(user.totalSteps)
    }, 0)
    .toLocaleString()
}

const totalStepsForAllUsers = (users) => {
  return users
    .filter((u) => u.days && u.days.length)
    .reduce((total, user) => {
      return (
        total +
        user.days.reduce((userTotal, day) => {
          return userTotal + parseInt(day.value)
        }, 0)
      )
    }, 0)
    .toLocaleString()
}

const AmountHeader = ({ dataUsers, allUsers }) => {
  if (dataUsers.length)
    return (
      <h1>
        Analysis - <strong>{dataUsers.length}</strong> users,{' '}
        <strong>{totalStepsForUsers(dataUsers)}</strong> steps
      </h1>
    )
  return (
    <h1>
      Before analysis - <strong>{allUsers.length}</strong> users,{' '}
      <strong>{totalStepsForAllUsers(allUsers)}</strong> steps
    </h1>
  )
}

export default AmountHeader
