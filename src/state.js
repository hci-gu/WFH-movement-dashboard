import { atom, selectorFamily } from 'recoil'

export const dashboardState = atom({
  key: 'dashboard',
  default: null,
})

export const dashBoardValue = selectorFamily({
  key: 'dashboard-value',
  get: (key) => ({ get }) => {
    const dashboard = get(dashboardState)

    return dashboard ? dashboard[key] : 0
  },
})
