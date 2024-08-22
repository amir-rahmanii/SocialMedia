import React, { useContext, useEffect } from 'react'
import MetaData from '../../Components/MetaData/MetaData'
import PostsContainer from '../../Components/Home/PostsContainer/PostsContainer'
import Sidebar from '../../Components/Home/Sidebar/Sidebar'
import Header from '../../Parts/Header/Header'
import { usePostUserInformation } from '../../hooks/user/useUser'
import SpinLoader from '../../Components/SpinLoader/SpinLoader'
import { AuthContext } from '../../../Context/AuthContext'

function Home() {

    const authContext = useContext(AuthContext);

    const { mutate: informationUser, isLoading, data , isSuccess } = usePostUserInformation();

    useEffect(() => {
        const userid = localStorage.getItem("userId")
        if (userid) {
            informationUser({ userid })
        }
    }, [])

    useEffect(() => {
        if(isSuccess && data){
            authContext?.setUser(data?.data.response.user)  
        }
    }, [isSuccess , data])
    



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