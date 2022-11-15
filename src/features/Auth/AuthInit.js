import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
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
      setShowSplashScreen(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{props.children}</>
}

export default AuthInit
