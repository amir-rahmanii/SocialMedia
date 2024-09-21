import React from 'react'
import SideBarLeft from '../../Parts/Admin/SideBarLeft/SideBarLeft'
import Header from '../../Parts/Admin/Header/Header'

function Dashboard() {
  return (
    <div className='bg-admin-black font-medium h-screen'>
      <Header/>
      <SideBarLeft />
    </div>
  )
}

export default Dashboard