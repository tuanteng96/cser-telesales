import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function UnauthenticateGuard({ children }) {
  const { tele, teleAdv } = useSelector(({ auth }) => ({
    tele: auth.Info?.rightsSum?.tele,
    teleAdv: auth.Info?.rightsSum?.teleAdv
  }))

  if (!tele && !teleAdv) {
    return <Navigate to="/yeu-cau-quyen-truy-cap" />
  }

  return children
}
