import  { useEffect, useState } from 'react'
import SkeletonUserItem from '../../User/SkeletonUserItem/SkeletonUserItem';
import { Link } from 'react-router-dom';
import usePostData from '../../../hooks/usePostData';
import useGetData from '../../../hooks/useGetData';
import {  userInformation } from '../../../hooks/user/user.types';
import { useQueryClient } from 'react-query';



function Sidebar() {
    const [followed, setFollowed] = useState<string[]>([])

    const { data: informationAllUser, isLoading } = useGetData<userInformation[]>(
        ['getAllUserInfo'],
        "users/all-users"
    );



    const { data: myInfo } = useGetData<userInformation>(
        ["getMyUserInfo"],
        "users/user-information"
    );

    const queryClient = useQueryClient();
    const { mutate: followToggle } = usePostData("users/followToggle"
        , "User Followed/UnFollowed succesfuly!",
        false,
        () => {
            queryClient.invalidateQueries(['getMyUserInfo'])
        }
    );






    // Check if the user is followed
    useEffect(() => {
        if (myInfo) {
            const followedUserIds = myInfo.following.map(follow => follow.userId);
            setFollowed(followedUserIds);
        }
    }, [myInfo]);







    return (
        <div className="fixed lg:right-[0px] z-50 hidden w-fit h-full lg:flex flex-col flex-auto m-8 xl:pr-8 -z-1">
            <div className="xl:ml-10 mt-4 flex flex-col lg:p-1 xl:p-4 rounded-sm">
                {isLoading ? (
                    Array(5).fill("").map((_, i) => (<SkeletonUserItem key={i} />))
                ) : (
                    <div className='flex flex-col px-1 gap-1 overflow-y-auto h-72'>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${myInfo?._id}`}>
                                    <img draggable="false" className="h-12 w-12 rounded-full shrink-0 object-cover mr-0.5" src={`${import.meta.env.VITE_API_BASE_URL}/${myInfo?.profilePicture.path}`} alt="avatar" />
                                </Link>
                                <div className='flex flex-col'>
                                    <Link to={`/profile/${myInfo?._id}`} className="text-sm font-semibold hover:underline text-black dark:text-white">{myInfo?.username}</Link>
                                    <Link to={`/profile/${myInfo?._id}`} className="text-sm text-gray-500">{myInfo?.name}</Link>
                                </div>
                            </div>
                            <div>
                                <p className='text-primary-blue text-xs hover:text-primaryhover-blue'>{myInfo?.role}</p>
                            </div>
                        </div>
                        <div className='py-3'>
                            <p className='text-gray-500 text-sm font-bold'>Suggested for you</p>
                        </div>
                        {informationAllUser?.map((data) => (
                            <div className='' key={data._id}>
                                {myInfo?._id !== data._id && (
                                    <div className='flex items-center justify-between pb-2'>
                                        <div className='flex items-center gap-2'>
                                            <Link to={`/profile/${data._id}`}>
                                                <img draggable="false" className="h-12 w-12 rounded-full shrink-0 object-cover mr-0.5" src={`${import.meta.env.VITE_API_BASE_URL}/${data.profilePicture.path}`} alt="avatar" />
                                            </Link>
                                            <div className='flex flex-col'>
                                                <Link to={`/profile/${data._id}`} className="text-sm font-semibold hover:underline text-black dark:text-white">{data.username}</Link>
                                                <Link to={`/profile/${data._id}`} className="text-sm text-gray-500">{data.name}</Link>
                                            </div>
                                        </div>
                                        <div className='ml-5'>
                                            {myInfo?._id !== data._id && (
                                                <button
                                                    onClick={() => {
                                                        const objFollow = {
                                                            userIdToFollow: data._id
                                                        }
                                                        followToggle(objFollow);
                                                    }}
                                                    className="font-sans transition-all duration-300 hover:bg-primaryhover-blue bg-primary-blue text-sm text-white hover:shadow-sm rounded-sm px-6 py-1.5"
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