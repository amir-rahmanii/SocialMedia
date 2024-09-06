import React, { useContext, useEffect } from 'react'
import MetaData from '../../Components/MetaData/MetaData'
import PostsContainer from '../../Components/Home/PostsContainer/PostsContainer'
import Sidebar from '../../Components/Home/Sidebar/Sidebar'
import { useGetUserInformation } from '../../hooks/user/useUser'
import SpinLoader from '../../Components/SpinLoader/SpinLoader'
import { AuthContext } from '../../Context/AuthContext'
import SideBarLeft from '../../Parts/SideBarLeft/SideBarLeft'

function Home() {

    const authContext = useContext(AuthContext);
    const { data: informationUser, isLoading , isSuccess } = useGetUserInformation();
  

  
    useEffect(() => {
        if(isSuccess && informationUser){
            authContext?.setUser(informationUser.response.user)  
        }
    }, [isSuccess , informationUser])
    



    return (
        <>
            {isLoading ? (
                <SpinLoader />
            ) : (
                <>
                    <MetaData title="Instagram" />
                    {/* <Header /> */}
                    <SideBarLeft/>
                    <div className="flex gap-2 h-full lg:w-full xl:w-5/6 mx-auto p-3 sm:p-0">
                        <PostsContainer />
                        <Sidebar  />
                    </div>
                </>
            )}
        </>
    )
}

export default Home