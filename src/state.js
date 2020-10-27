import { atom, selector } from 'recoil'

export const dashboardState = atom({
  key: 'dashboard',
  default: null,
})

export const numberOfUsers = selector({
  key: 'number-of-users',
  get: ({ get }) => {
    const dashboard = get(dashboardState)

    return dashboard ? dashboard.users : '-'
  },
})

export const stepsTaken = selector({
  key: 'steps-taken',
  get: ({ get }) => {
    const dashboard = get(dashboardState)

    return dashboard ? dashboard.steps : '-'
  },
})
