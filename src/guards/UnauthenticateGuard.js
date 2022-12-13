import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function UnauthenticateGuard({ children }) {
  const { tele, teleAdv } = useSelector(({ auth }) => ({
    tele: auth.Info?.rightsSum?.tele?.hasRight,
    teleAdv: auth.Info?.rightsSum?.teleAdv?.hasRight
  }))

  if (!tele && !teleAdv) {
    return <Navigate to="/yeu-cau-quyen-truy-cap" />
  }

  return children
}
