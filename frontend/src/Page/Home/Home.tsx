import React, { useEffect } from 'react'
import MetaData from '../../Components/MetaData/MetaData'
import PostsContainer from '../../Components/Home/PostsContainer/PostsContainer'
import Sidebar from '../../Components/Home/Sidebar/Sidebar'
import Header from '../../Parts/Header/Header'
import { usePostUserInformation } from '../../hooks/user/useUser'
import SpinLoader from '../../Components/SpinLoader/SpinLoader'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function Home() {
    const navigate = useNavigate()

    const { mutate: informationUser, isLoading, data, isError } = usePostUserInformation();

    useEffect(() => {
        const userid = localStorage.getItem("userId")
        if (userid) {
            informationUser({ userid })
        }
    }, [])

    useEffect(() => {
        if (isError) {
            toast.error("Sorry you should login again",
                {
                    icon: '😩',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            )
            navigate("/login")
        }
    }, [isError])

    // console.log(data?.data.response.user);



    return (
        <>
            {isLoading ? (
                <SpinLoader />
            ) : (
                <>
                    <MetaData title="Instagram" />
                    <Header />
                    <div className="flex h-full md:w-4/5 lg:w-4/6 mt-14 mx-auto">
                        <PostsContainer />
                        <Sidebar {...data?.data.response.user} />
                    </div>
                </>
            )}
        </>
    )
}

export default Home