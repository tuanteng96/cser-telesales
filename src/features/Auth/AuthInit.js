import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { DevHelpers } from 'src/helpers/DevHelpers'
import { LayoutSplashScreen } from 'src/layout/_core/SplashScreen'
import { setProfile } from './AuthSlice'

function checkInfo(fn) {
  if (window.top.Info && window.top.token) {
    fn()
  } else {
    setTimeout(() => {
      checkInfo(fn)
    }, 50)
  }
}

function AuthInit(props) {
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  const dispatch = useDispatch()
  // We should request user by authToken before rendering the application

  useEffect(() => {
    async function requestUser() {
      if (DevHelpers.isDevelopment()) {
        window.Info = {
          User: {
            FullName: 'Admin System',
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
          CrStockID: 8975, //8975
          rightsSum: {
            tele: {
              hasRight: true,
              stocks: [{ ID: 8975, Title: 'Cser Hà Nội' }],
              IsAllStock: false
            },
            teleAdv: {
              hasRight: true,
              stocks: [{ ID: 10053, Title: 'Cser Hồ Chí Minh' }],
              IsAllStock: false
            }
          }
        }
        window.token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBdXRoMlR5cGUiOiJVc2VyRW50IiwiSUQiOiIxIiwiVG9rZW5JZCI6IjEwMjAxMDMwMTAyMDIwMzUiLCJuYmYiOjE2NzE1MDMxOTUsImV4cCI6MTY3MjEwNzk5NSwiaWF0IjoxNjcxNTAzMTk1fQ.Ij7G_NrEKbHKu3YLX2aI9bQJsvuaOzz8OzJWIndUbKo'
      }
      checkInfo(() => {
        dispatch(
          setProfile({
            Info: window.top.Info,
            token: window.top.token
          })
        )
        setShowSplashScreen(false)
      })
    }
    if (!window.top.Info || !window.top.token) {
      requestUser()
    } else {
      dispatch(
        setProfile({
          Info: window.top.Info,
          token: window.top.token
        })
      )
      setShowSplashScreen(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{props.children}</>
}

export default AuthInit
