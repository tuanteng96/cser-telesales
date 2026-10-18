import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../_assets/sass/pages/_telesales.scss'

export const TelesalesContext = React.createContext()

function Telesales({ children }) {
  const [isSidebar, setIsSidebar] = useState(false)
  const [isProfile, setIsProfile] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const openMemberFromParent = () => {
      let url
      try {
        url = new URL(window.top.location.href)
      } catch {
        // A parent on another origin cannot be inspected by this iframe.
        return
      }
      const memberId = url.hash.match(/^#id:([1-9]\d*)$/)?.[1]
      if (
        /^\/admin\/?$/i.test(url.pathname) &&
        url.searchParams.get('mdl20') === 'care' &&
        url.searchParams.get('act20') === 'tele' &&
        memberId
      ) {
        navigate(`/danh-sach/${memberId}/dich-vu`, {
          replace: true,
          state: { from: '/danh-sach' }
        })
        url.hash = ''
        window.top.history.replaceState(window.top.history.state, '', url.href)
      }
    }

    openMemberFromParent()
    try {
      window.top.addEventListener('hashchange', openMemberFromParent)
      return () =>
        window.top.removeEventListener('hashchange', openMemberFromParent)
    } catch {
      // Cross-origin parents cannot be subscribed to directly either.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onOpenSidebar = () => {
    setIsSidebar(true)
  }

  const onHideSidebar = () => {
    setIsSidebar(false)
  }

  const onOpenProfile = () => {
    setIsProfile(true)
  }

  const onHideProfile = () => {
    setIsProfile(false)
  }

  return (
    <TelesalesContext.Provider
      value={{
        isSidebar: isSidebar,
        onHideSidebar: onHideSidebar,
        onOpenSidebar: onOpenSidebar,
        isProfile: isProfile,
        onHideProfile: onHideProfile,
        onOpenProfile: onOpenProfile
      }}
    >
      {children}
    </TelesalesContext.Provider>
  )
}

export default Telesales
