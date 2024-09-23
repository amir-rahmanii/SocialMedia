import React from 'react'
import SideBarLeft from '../../Parts/Admin/SideBarLeft/SideBarLeft'
import Header from '../../Parts/Admin/Header/Header'
import useGetData from '../../hooks/useGetData';
import { userInformation } from '../../hooks/user/user.types';
import { Navigate, Outlet } from 'react-router-dom';
import SpinLoader from '../../Components/SpinLoader/SpinLoader';
import NotFound from '../NotFound/NotFound';

function Dashboard() {

  const { data: myInfo, isSuccess } = useGetData<userInformation>(
    ["getMyUserInfo"],
    "users/user-information"
  );



  return (
    <>
      {isSuccess && (
        myInfo?.role === "ADMIN" ? (
          <div className='bg-admin-black font-sans min-h-screen text-white'>
            <SideBarLeft />
            <Header />
            <div className="ml-64 mt-12">
              <div className="flex gap-2 h-full w-full p-[74px]">
                <Outlet />
              </div>
            </div>
          </div>
        ) : (
          <NotFound />
        )
      )}
    </>
  )
}

export default Dashboard