import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoutes: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      {localStorage.getItem("access-token") ? children : <Navigate to='/login' />}
    </>
  )
}

export default PrivateRoutes