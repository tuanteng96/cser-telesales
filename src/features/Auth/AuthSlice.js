import { createSlice } from '@reduxjs/toolkit'

const Auth = createSlice({
  name: 'auth',
  initialState: {
    Info: window.top.Info,
    Token: window.top.token
  },
  reducers: {
    setProfile: (state, { payload }) => {
      //Unauthorized
      let PermissionStocks = []
      if (
        payload?.Info?.rightsSum?.tele?.hasRight ||
        payload?.Info?.rightsSum?.teleAdv?.hasRight
      ) {
        if (payload?.Info?.rightsSum?.tele?.stocks) {
          PermissionStocks = payload?.Info?.rightsSum?.tele?.stocks || []
        } else {
          PermissionStocks = 'All Stocks'
        }
      } else {
        PermissionStocks = '401 Unauthorized'
      }
      return {
        ...state,
        Token: payload.token,
        Info: payload.Info,
        PermissionStocks: PermissionStocks
      }
    }
  }
})

const { reducer, actions } = Auth
export const { setProfile } = actions
export default reducer
