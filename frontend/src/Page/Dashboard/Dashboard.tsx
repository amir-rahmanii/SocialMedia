import { useState } from 'react'
import SideBarLeft from '../../Parts/Admin/SideBarLeft/SideBarLeft'
import Header from '../../Parts/Admin/Header/Header'
import useGetData from '../../hooks/useGetData';
import { userInformation } from '../../hooks/user/user.types';
import { Outlet } from 'react-router-dom';
import NotFound from '../NotFound/NotFound';

function Dashboard() {

  const { data: myInfo, isSuccess } = useGetData<userInformation>(
    ["getMyUserInfo"],
    "users/user-information"
  );

  const [showSidebarLeftMobile , setShowSidebarLeftMobile] = useState(false)



  return (
    <>
      {isSuccess && (
        myInfo?.role === "ADMIN" ? (
          <div className='bg-admin-black font-sans min-h-screen text-white'>
            <SideBarLeft setShowSidebarLeftMobile={setShowSidebarLeftMobile} showSidebarLeftMobile={showSidebarLeftMobile} />
            <Header setShowSidebarLeftMobile={setShowSidebarLeftMobile} showSidebarLeftMobile={showSidebarLeftMobile}/>
            <div className="md:mr-16 lg:mr-40 xl:mr-64 mt-12">
              <div className="flex gap-2 h-full w-full py-14 p-4 md:p-[74px]">
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