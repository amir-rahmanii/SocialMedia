import React, { useContext, useEffect } from 'react'
import MetaData from '../../Components/MetaData/MetaData'
import PostsContainer from '../../Components/Home/PostsContainer/PostsContainer'
import Sidebar from '../../Components/Home/Sidebar/Sidebar'
import Header from '../../Parts/Header/Header'
import { usePostUserInformation } from '../../hooks/user/useUser'
import SpinLoader from '../../Components/SpinLoader/SpinLoader'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AuthContext } from '../../../Context/AuthContext'

function Home() {
    const navigate = useNavigate()
    const authContext = useContext(AuthContext);

    const { mutate: informationUser, isLoading, data , isSuccess } = usePostUserInformation();

    useEffect(() => {
        const userid = localStorage.getItem("userId")
        if (userid) {
            informationUser({ userid })
        }
    }, [])

    useEffect(() => {
        // if (isError) {
        //     toast.error("Sorry you should login again",
        //         {
        //             icon: '😩',
        //             style: {
        //                 borderRadius: '10px',
        //                 background: '#333',
        //                 color: '#fff',
        //             },
        //         }
        //     )
        //     navigate("/login")
        // }
        if(isSuccess){
            authContext?.setUser(data?.data.response.user)  
        }
    }, [isSuccess])
    



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