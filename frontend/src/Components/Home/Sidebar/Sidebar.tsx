import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../Context/AuthContext';
import { useGetAllUsersInformation, usePostFollowToggle } from '../../../hooks/user/useUser';
import SkeletonUserItem from '../../User/SkeletonUserItem/SkeletonUserItem';
import { Link } from 'react-router-dom';
import DateConverter from '../../../utils/DateConverter';
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
        <div className="fixed  lg:right-[50px] xl:right-[140px] w-fit h-full hidden lg:flex flex-col flex-auto m-8 mt-12 pr-8 -z-1">

            <div className="ml-10 flex flex-col lg:p-1 xl:p-4 bg-white rounded">

                {/* <!-- self profile card --> */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-auto space-x-4 items-center">
                        <img draggable="false" className="w-14 h-14 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${authContext?.user?.profilePicture.filename}`} alt="avatar" />
                        <div className="flex flex-col">
                            <p className="text-black text-sm font-semibold line-clamp-1">{authContext?.user?.email}</p>
                            <span className="text-gray-400 text-sm line-clamp-1">{authContext?.user?.username}</span>
                        </div>
                    </div>
                    <span className="text-blue-500 text-xs font-semibold">{authContext?.user?.role === "ADMIN" ? "Admin" : "User"}</span>
                </div>

                {/* <!-- suggestions --> */}
                <div className="flex justify-between items-center mt-5">
                    <p className="font-semibold text-gray-500 text-sm line-clamp-1">Hi {authContext?.user?.name} Welcome to my project.</p>
                    <span className="text-black text-xs font-semibold cursor-pointer">See All</span>
                </div>

                {/* <!-- suggested profile lists --> */}
                <div className="flex flex-col flex-auto space-y-3.5">

                    {/* {loading ?
                Array(5).fill("").map((el, i) => (<SkeletonUserItem key={i} />))
                :
                users?.map((user) => (
                    <UserListItem {...user} key={user._id} />
                ))
            } */}
                </div>

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

            <div className="ml-10 mt-4 flex flex-col h-80 overflow-auto lg:p-1 xl:p-4 bg-white rounded">
                {isLoading ? (
                    Array(5).fill("").map((el, i) => (<SkeletonUserItem key={i} />))
                ) : (
                    <div className='flex flex-col gap-1'>
                        {informationAllUser?.response?.users?.map((data) => (
                            <div key={data._id}>
                            {authContext?.user?._id !== data._id && (
                                    <div className='flex items-center justify-between border-b pb-2'>
                                        <div className='flex items-center gap-2'>
                                            <Link to={`/profile/${data._id}`}>
                                                <img draggable="false" className="h-12 w-12 rounded-full shrink-0 object-cover mr-0.5" src={`http://localhost:4002/images/profiles/${data.profilePicture.filename}`} alt="avatar" />
                                            </Link>
                                            <div className='flex flex-col'>
                                                <Link to={`/profile/${data._id}`} className="text-sm font-semibold hover:underline">{data.username}</Link>
                                                <p className="text-xs text-gray-500 flex flex-col"> <span>Registered :</span>  <DateConverter date={data.createdAt} /></p>
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
            </div>
        </div >
    )
}

export default Sidebar