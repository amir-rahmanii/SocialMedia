import { Dialog } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import DateConverter from '../../utils/DateConverter'
import { closeIcon } from '../SvgIcon/SvgIcon'
import { Link } from 'react-router-dom'
import { usePostFollowToggle } from '../../hooks/user/useUser'
import toast from 'react-hot-toast'
import { AuthContext } from '../../Context/AuthContext'

type ShowWhoLikedProps = {
    isOpenShowLiked: boolean,
    setIsOpenShowLiked: (value: boolean) => void,
    userLiked: {
        createdAt: Date,
        postid: string,
        updatedAt: Date,
        username: string,
        userid: string,
        _id: string,
        userPicture: { path: string, filename: string }
    }[]
}


function ShowWhoLiked({ userLiked, isOpenShowLiked, setIsOpenShowLiked }: ShowWhoLikedProps) {

    const { mutate: followToggle, isSuccess: isSuccessFollowToggle, isError: isErrorFollowToggle, error: errorFollow, data: dataFollow } = usePostFollowToggle();
    const [followed, setFollowed] = useState<string[]>([])
    const authContext = useContext(AuthContext)


    useEffect(() => {
        if (isErrorFollowToggle) {
            if (errorFollow && (errorFollow as any).response) {
                toast.error((errorFollow as any).response.data.error.message,
                    {
                        icon: '❌',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                )
            }
        }

        if (isSuccessFollowToggle) {
            toast.success(dataFollow.data.message,
                {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            )
        }
    }, [isErrorFollowToggle, isSuccessFollowToggle])


    // Check if the user is followed
    useEffect(() => {
        if (authContext?.user?.following) {
            const followedUserIds = authContext.user.following.map(follow => follow.userId);
            setFollowed(followedUserIds);
        }
    }, [authContext?.user?.following]);


    return (
        <Dialog open={isOpenShowLiked} onClose={() => setIsOpenShowLiked(false)} maxWidth='xl'>
            <div className="flex flex-col h-56 overflow-y-auto xl:w-screen max-w-xl bg-white dark:bg-black">
                <div className="bg-white dark:bg-black py-3 border-b dark:border-gray-300/20 border-gray-300  px-4 flex justify-between w-full">
                    <span className="font-medium text-black dark:text-white">List Users Liked</span>
                    <button className='w-6 h-6 text-black dark:text-white' onClick={() => setIsOpenShowLiked(false)}>
                        {closeIcon}
                    </button>
                </div>
                {userLiked.length > 0 ? (
                    <div className='py-3 px-4 flex flex-col'>
                        {userLiked.map((data, index) => (
                            <div key={index} className='flex items-center justify-between border-b dark:border-gray-300/20 border-gray-300 p-2'>
                                <div className='flex items-center gap-2'>
                                    <Link to={`/profile/${data.userid}`}>
                                        <img draggable="false" className="h-12 w-12 rounded-full shrink-0 object-cover mr-0.5" src={`http://localhost:4002/images/profiles/${data.userPicture.filename}`} alt="avatar" />
                                    </Link>
                                    <div className='flex flex-col'>
                                        <Link to={`/profile/${data.userid}`} className="text-sm text-black dark:text-white font-semibold hover:underline">{data.username}</Link>
                                        <p className='text-xs text-gray-500'><DateConverter date={data.createdAt} /></p>
                                    </div>
                                </div>
                                <div className='ml-5'>
                                {authContext?.user?._id !== data.userid && (
                                        <button
                                            onClick={() => {
                                                followToggle(data.userid);
                                            }}
                                            className="font-medium transition-all duration-300 hover:bg-primaryhover-blue bg-primary-blue text-sm text-white hover:shadow rounded px-6 py-1.5"
                                        >
                                            {followed.includes(data.userid) ? "UnFollow" : "Follow"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='py-3 px-4 text-xl'>
                        No one has liked this post 😩
                    </div>
                )}
            </div>
        </Dialog>
    )
}

export default ShowWhoLiked