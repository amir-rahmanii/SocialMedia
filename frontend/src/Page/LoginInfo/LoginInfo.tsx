import React from 'react'
import MetaData from '../../Components/MetaData/MetaData'
import Header from '../../Parts/Header/Header'
import SideBarLeft from '../../Parts/SideBarLeft/SideBarLeft'
import SideBarBottom from '../../Parts/SideBarBottom/SideBarBottom'
import TableLogin from '../../Components/User/TableLogin/TableLogin'
import { useGetUserInformation } from '../../hooks/user/useUser'
import SpinLoader from '../../Components/SpinLoader/SpinLoader'

function LoginInfo() {

    const { data: myInformationData, isLoading: isLoadingMyInformationData } = useGetUserInformation();



    return (
        <>
            <MetaData title="login-info" />
            <Header />
            <div>
                {isLoadingMyInformationData ? (
                    <SpinLoader />
                ) : (
                    <div className='w-full md:w-4/6 md:ml-44 mt-14 lg:ml-60 xl:ml-72'>
                        <h3 className='text-2xl text-center my-7 font-medium text-black dark:text-white'>User Login info</h3>
                        <TableLogin  loginInformation={myInformationData?.response.user.systemInfos}/>
                    </div>
                )}
            </div>
            <SideBarLeft />
            <SideBarBottom />
        </>
    )
}

export default LoginInfo