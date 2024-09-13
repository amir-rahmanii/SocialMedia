import React, { useContext, useEffect } from 'react'
import MetaData from '../../Components/MetaData/MetaData'
import PostsContainer from '../../Components/Home/PostsContainer/PostsContainer'
import Sidebar from '../../Components/Home/Sidebar/Sidebar'
import SideBarLeft from '../../Parts/SideBarLeft/SideBarLeft'
import Header from '../../Parts/Header/Header'
import SideBarBottom from '../../Parts/SideBarBottom/SideBarBottom'
import { useGetMyUsersInfo } from '../../hooks/user/useUser'
import { AuthContext } from '../../Context/AuthContext'
import toast from 'react-hot-toast'
import SpinLoader from '../../Components/SpinLoader/SpinLoader'

function Home() {
    const authContext = useContext(AuthContext);
    const { data: myInfo, isLoading, isSuccess, isError } = useGetMyUsersInfo();

    useEffect(() => {
        if (isSuccess) {
            authContext?.setUser(myInfo);
        } else if (isError) {
            toast.error("please try again later 😩")
        }
    }, [isSuccess, isError]);


    return (
        <>
            {isLoading ? (
                <SpinLoader />
            ) : (
                <>
                    <MetaData title="Instagram" />
                    <Header />
                    <SideBarLeft />
                    <div className="flex mt-10 md:mt-0 gap-2 h-full w-full xl:w-5/6 mx-auto p-3 sm:p-0">
                        <PostsContainer />
                        <Sidebar />
                    </div>
                    <SideBarBottom />
                </>
            )}

        </>

    )
}

export default Home