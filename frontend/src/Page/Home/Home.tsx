import React, { useContext, useEffect } from 'react'
import MetaData from '../../Components/MetaData/MetaData'
import PostsContainer from '../../Components/Home/PostsContainer/PostsContainer'
import Sidebar from '../../Components/Home/Sidebar/Sidebar'
import Header from '../../Parts/Header/Header'
import { useGetUserInformation } from '../../hooks/user/useUser'
import SpinLoader from '../../Components/SpinLoader/SpinLoader'
import { AuthContext } from '../../Context/AuthContext'

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
                    <Header />
                    <div className="flex gap-2 h-full lg:w-4/6 mt-14 mx-auto p-3 sm:p-0">
                        <PostsContainer />
                        <Sidebar  />
                    </div>
                </>
            )}
        </>
    )
}

export default Home