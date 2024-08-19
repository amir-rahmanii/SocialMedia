import React, { useContext } from 'react'
import { AuthContext } from '../../../../Context/AuthContext';



function Sidebar() {
    const authContext = useContext(AuthContext);
    return (
        <div className="fixed  lg:right-[50px] xl:right-[150px] w-fit h-full hidden lg:flex flex-col flex-auto m-8 mt-12 pr-8 -z-1">

            <div className="ml-10 flex flex-col p-2 bg-white">

                {/* <!-- self profile card --> */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-auto space-x-4 items-center">
                        <img draggable="false" className="w-14 h-14 rounded-full object-cover" src="/src/assets/images/hero.png" alt="{user.name}" />
                        <div className="flex flex-col">
                            <p className="text-black text-sm font-semibold line-clamp-1">{authContext?.user?.email}</p>
                            <span className="text-gray-400 text-sm line-clamp-1">{authContext?.user?.username}</span>
                        </div>
                    </div>
                    <span className="text-blue-500 text-xs font-semibold">{authContext?.user?.role === "ADMIN" ? "Admin" : "User" }</span>
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
        </div >
    )
}

export default Sidebar