import { createSlice } from '@reduxjs/toolkit'
import { DevHelpers } from 'src/helpers/DevHelpers'

if (DevHelpers.isDevelopment()) {
  window.Info = {
    User: {
      UserName: 'admin',
      ID: 1
    },
    Stocks: [
      {
        ID: 778,
        Title: 'Quản lý cơ sở',
        ParentID: 0
      },
      {
        ID: 8975,
        Title: 'Cser Hà Nội',
        ParentID: 778
      },
      {
        ID: 10053,
        Title: 'Cser Hồ Chí Minh',
        ParentID: 778
      }
    ],
    CrStockID: 8975,
    rightsSum: {
      tele: true,
      teleAdv: true
    }
  }
  window.token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBdXRoMlR5cGUiOiJVc2VyRW50IiwiSUQiOiIxIiwiVG9rZW5JZCI6IjEwMjAxMDMwMTAyMDE0OTUiLCJuYmYiOjE2NjQ5MzQwMDAsImV4cCI6MTY2NTUzODgwMCwiaWF0IjoxNjY0OTM0MDAwfQ.vwZRTrQyOBY8PNI_daG98K8bgNgfYJpDSJY427nB9ck'
}

const Auth = createSlice({
  name: 'auth',
  initialState: {
    Info: window.top.Info,
    Token: window.top.token
  },
  reducers: {
    setProfile: (state, { payload }) => {
      return {
        ...state,
        Token: payload.token,
        Info: payload.Info
      }
    }
  }
})

const { reducer, actions } = Auth
export const { setProfile } = actions
export default reducer
