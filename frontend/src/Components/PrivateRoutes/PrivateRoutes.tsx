import React from 'react'
import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'

const PrivateRoutes : React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <>
    {Cookies.get("access-token") ? children : <Navigate to='/login' /> }
    </>
  )
}

export default PrivateRoutes