import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../Context/AuthContext';
import { useGetAllUsersInformation, usePostFollowToggle } from '../../../hooks/user/useUser';
import SkeletonUserItem from '../../User/SkeletonUserItem/SkeletonUserItem';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';



function Sidebar() {

    const authContext = useContext(AuthContext);
    const { data: informationAllUser, isLoading, isSuccess: isSuccessGetAllinfo } = useGetAllUsersInformation();
    const { mutate: followToggle, isSuccess: isSuccessFollowToggle, isError: isErrorFollowToggle, error: errorFollow, data: dataFollow } = usePostFollowToggle();
    const [followed, setFollowed] = useState<string[]>([])


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
        <div className="fixed lg:right-[0px] w-fit h-full hidden lg:flex flex-col flex-auto m-8 xl:pr-8 -z-1">
            <div className="xl:ml-10 mt-4 flex flex-col h-96 overflow-auto lg:p-1 xl:p-4 rounded">
                {isLoading ? (
                    Array(5).fill("").map((el, i) => (<SkeletonUserItem key={i} />))
                ) : (
                    <div className='flex flex-col gap-1'>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${authContext?.user?._id}`}>
                                    <img draggable="false" className="h-12 w-12 rounded-full shrink-0 object-cover mr-0.5" src={`http://localhost:4002/images/profiles/${authContext?.user?.profilePicture.filename}`} alt="avatar" />
                                </Link>
                                <div className='flex flex-col'>
                                    <Link to={`/profile/${authContext?.user?._id}`} className="text-sm font-semibold hover:underline text-black dark:text-white">{authContext?.user?.username}</Link>
                                    <Link to={`/profile/${authContext?.user?._id}`} className="text-sm text-gray-500">{authContext?.user?.name}</Link>
                                </div>
                            </div>
                            <div>
                                <p className='text-primary-blue text-xs hover:text-primaryhover-blue'>{authContext?.user?.role}</p>
                            </div>
                        </div>
                        <div className='py-3'>
                            <p className='text-gray-500 text-sm font-bold'>Suggested for you</p>
                        </div>
                        {informationAllUser?.response?.users?.slice(0 , 3).map((data) => (
                            <div key={data._id}>
                                {authContext?.user?._id !== data._id && (
                                    <div className='flex items-center justify-between pb-2'>
                                        <div className='flex items-center gap-2'>
                                            <Link to={`/profile/${data._id}`}>
                                                <img draggable="false" className="h-12 w-12 rounded-full shrink-0 object-cover mr-0.5" src={`http://localhost:4002/images/profiles/${data.profilePicture.filename}`} alt="avatar" />
                                            </Link>
                                            <div className='flex flex-col'>
                                                <Link to={`/profile/${data._id}`} className="text-sm font-semibold hover:underline text-black dark:text-white">{data.username}</Link>
                                                <Link to={`/profile/${data._id}`} className="text-sm text-gray-500">{data.name}</Link>
                                            </div>
                                        </div>
                                        <div className='ml-5'>
                                            {authContext?.user?._id !== data._id && (
                                                <button
                                                    onClick={() => {
                                                        followToggle(data._id);
                                                    }}
                                                    className="font-medium transition-all duration-300 hover:bg-primaryhover-blue bg-primary-blue text-sm text-white hover:shadow rounded px-6 py-1.5"
                                                >
                                                    {followed.includes(data._id) ? "UnFollow" : "Follow"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {/* <!-- sidebar footer container--> */}
                <div className="flex flex-col mt-8 space-y-6 text-xs text-gray-400">
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-1.5">
                            {['About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms', 'Locations'].map((el, i) => (
                                <a href="#" key={i}>{el}</a>
                            ))}
                        </div>
                        <div className="flex items-center space-x-1.5">
                            {['Top Accounts', 'Hashtags', 'Language'].map((el, i) => (
                                <a href="#" key={i}>{el}</a>
                            ))}
                        </div>
                    </div>
                    <span>&copy; {new Date().getFullYear()} INSTAGRAM FROM META (Amirreza Rahmani)</span>
                </div>
            </div>
        </div >
    )
}

export default Sidebar