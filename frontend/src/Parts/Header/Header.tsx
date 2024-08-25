import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { exploreOutline, homeFill, homeOutline, likeOutline, messageFill, messageOutline, postUploadOutline } from '../../Components/SvgIcon/SvgIcon';
import SearchBox from '../../Components/Header/SearchBox/SearchBox';
import ProfileDetails from '../../Components/Header/ProfileDetails/ProfileDetails';
import NewPost from '../../Components/Header/NewPost/NewPost';
import { AuthContext } from '../../Context/AuthContext';


export default function Header() {



    const [profileToggle, setProfileToggle] = useState(false)
    const [newPost, setNewPost] = useState(false);
    const authContext = useContext(AuthContext);



    return (
        <nav className="fixed top-0 w-full border-b bg-white z-10">
        {/* <!-- navbar container --> */}
        <div className="flex flex-row justify-between items-center py-2 px-3.5 sm:w-full sm:py-2 sm:px-4 md:w-full md:py-2 md:px-6 xl:w-4/6 xl:py-3 xl:px-8 mx-auto">

            {/* <!-- logo --> */}
            <Link className='shrink-0 hidden md:block' to="/">
                <img draggable="false" className="mx-auto  h-[35px] w-[110px] object-contain" src="/src/assets/images/Instagram.png" alt="instagram" />
            </Link>

            <div>
                <SearchBox />

            </div>

            {/* <!-- icons container  --> */}
            <div className="flex items-center space-x-6 sm:mr-5">
                {/* <Link to="/">{profileToggle || !onHome ? homeOutline : homeFill}</Link>

                <Link to="/direct/inbox">{onChat ? messageFill : messageOutline}</Link> */}

                <div onClick={() => setNewPost(true)} className="cursor-pointer">{postUploadOutline}</div>

                <span className="hidden sm:block">{exploreOutline}</span>
                <span className="hidden sm:block">{likeOutline}</span>

                <div onClick={() => setProfileToggle(!profileToggle)} className={`${profileToggle && 'border-black border'  && 'border-black border'} rounded-full cursor-pointer h-7 w-7 p-[0.5px]`}><img draggable="false" loading="lazy" className="w-full h-full rounded-full object-cover" src={`http://localhost:4002/images/profiles/${authContext?.user?.profilePicture.filename}`} alt="profile" /></div>
            </div>

            {profileToggle &&
                <ProfileDetails setProfileToggle={setProfileToggle} />
            }

            <NewPost newPost={newPost} setNewPost={setNewPost} />

        </div>
    </nav>
    )
}
