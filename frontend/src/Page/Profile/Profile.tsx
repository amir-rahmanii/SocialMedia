import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../Context/AuthContext'
import MetaData from '../../Components/MetaData/MetaData'
import { Link } from 'react-router-dom'
import { changeProfilePicture, postsIconFill, postsIconOutline, postUploadOutline, reelsIcon, savedIconFill, savedIconOutline, settingsIcon, taggedIcon } from '../../Components/SvgIcon/SvgIcon'
import Header from '../../Parts/Header/Header'
import { useGetMyPost, useGetMySavedPost } from '../../hooks/post/usePost'
import PostContainerUser from '../../Components/User/PostContainerUser/PostContainerUser'
import SpinLoader from '../../Components/SpinLoader/SpinLoader'
import NewPost from '../../Components/Header/NewPost/NewPost'
import { usePostUserInformation, useUpdateUserProfile } from '../../hooks/user/useUser'
import toast from 'react-hot-toast'
import ChangeProfile from '../../Components/User/ChangeProfile/ChangeProfile'


function Profile() {
  // const [follow, setFollow] = useState(false);
  // const [viewModal, setViewModal] = useState(false);
  // const [followersModal, setFollowersModal] = useState(false);
  // const [usersArr, setUsersArr] = useState([]);
  const [savedTab, setSavedTab] = useState(false);
  const [newPost, setNewPost] = useState(false);
  const [isShowChangeProfile, setIsShowChangeProfile] = useState(false);

  // const navigate = useNavigate()


  const authContext = useContext(AuthContext);

  const { data: myPost, isLoading } = useGetMyPost();
  const { data: mySavedPost, isLoading: isLoadingMySavedPost } = useGetMySavedPost();

  const { mutate: informationUser, data, isSuccess } = usePostUserInformation();


  useEffect(() => {
    const userid = localStorage.getItem("userId");
    const tab = localStorage.getItem("tab");


    if (tab === "mySavedPosts") {
      setSavedTab(true)
    } else {
      setSavedTab(false)
    }


    if (userid) {
      informationUser({ userid })
    }
  }, [isShowChangeProfile])

  useEffect(() => {
    if (isSuccess && data) {
      authContext?.setUser(data?.data.response.user)
    }
  }, [isSuccess, data])


  useEffect(() => {
    localStorage.setItem("tab", savedTab ? "mySavedPosts" : "myPosts")
  }, [savedTab])





  // useEffect(() => {
  //   if (isError) {
  //     toast.error("Sorry you should login again",
  //       {
  //         icon: '😩',
  //         style: {
  //           borderRadius: '10px',
  //           background: '#333',
  //           color: '#fff',
  //         },
  //       }
  //     )
  //     navigate("/login")
  //   }
  // }, [isError])



  return (
    <>
      <MetaData title={`Profile • Instagram photos and videos`} />
      <Header />
      <div className="mt-16 xl:w-2/3 mx-auto p-3">

        <div className="sm:flex w-full sm:py-8 bg-white rounded-t">

          {/* profile picture */}
          <div className="sm:w-1/3 flex justify-center mx-auto sm:mx-0">
            <img draggable="false" className="w-40 h-40 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${authContext?.user?.profilePicture.filename}`} alt="profile" />


            <button onClick={() => setIsShowChangeProfile(true)} className=' flex flex-col items-center group self-end cursor-pointer'>
              <div className='flex flex-col items-center'>
                <div className='w-10 h-10 text-black hover:w-12 hover-h-12 transition-all duration-300'>
                  {changeProfilePicture}
                </div>
              </div>
            </button>

            {isShowChangeProfile && (
              <ChangeProfile isShowChangeProfile={isShowChangeProfile} setIsShowChangeProfile={setIsShowChangeProfile} />
            )}


          </div>

          {/* profile details */}
          <div className="flex flex-col gap-6 p-4 sm:w-2/3 sm:p-1">
            <div className="flex items-center gap-8 sm:justify-start justify-between">

              <h2 className="text-2xl sm:text-3xl font-thin">{authContext?.user?.username}</h2>

              <div className="flex gap-3 items-center">
                <Link to="/accounts/edit" className="border font-medium hover:bg-gray-50 text-sm rounded px-2 py-1">Edit Profile</Link>
                <Link to="/accounts/edit">{settingsIcon}</Link>
              </div>

              {/* <div className="flex gap-3 items-center">
                               {follow ? ( */}
              {/* //         <>
                            //             <button onClick={addToChat} className="border rounded px-2.5 py-[0.3rem] text-sm font-medium hover:bg-gray-100">Message</button>
                            //             <button onClick={handleFollow} className="font-medium text-sm bg-red-50 rounded py-1.5 px-3 text-red-600 hover:bg-red-100 hover:text-red-700">Unfollow</button>
                            //         </>
                            //     ) : (
                            //         <button onClick={handleFollow} className="font-medium bg-primary-blue text-sm text-white hover:shadow rounded px-6 py-1.5">Follow</button>
                            //     )}
                            //     <span className="sm:block hidden">{metaballsMenu}</span>
                            // </div> */}

            </div>

            <div className="flex justify-between items-center max-w-[21.5rem]">
              <div className="cursor-pointer"><span className="font-semibold">
                {myPost && myPost.response && myPost.response.allPosts ? (
                  myPost.response.allPosts.length
                ) : (
                  0
                )}

              </span> posts</div>
              <div className="cursor-pointer"><span className="font-semibold">0</span> followers</div>
              <div className="cursor-pointer"><span className="font-semibold">0</span> following</div>
            </div>

            {/* bio */}
            <div className="max-w-full">
              <p className="font-medium">{authContext?.user?.name}</p>
              <p className="whitespace-pre-line">Lorem ipsum</p>
              {/* {user?.website &&
                            <a href={user.website} target="_blank" className="text-blue-900 font-medium">{new URL(user.website).hostname}</a>
                        } */}
            </div>
          </div>

        </div>

        {/* {followersModal ?
                <UsersDialog title="Followers" open={viewModal} onClose={closeModal} usersList={user?.followers} />
                :
                <UsersDialog title="Following" open={viewModal} onClose={closeModal} usersList={user?.following} />
            } */}

        <div className="border-t  bg-white rounded-b">

          {/* tabs */}
          <div className="flex gap-12 justify-center">
            <span onClick={() => setSavedTab(false)} className={`${savedTab ? 'text-gray-400' : 'border-t border-black'} py-3 cursor-pointer flex items-center text-[13px] uppercase gap-3 tracking-[1px] font-medium`}>
              {savedTab ? postsIconOutline : postsIconFill} posts</span>

            <span onClick={() => setSavedTab(true)} className={`${savedTab ? 'border-t border-black' : 'text-gray-400'} py-3 cursor-pointer flex items-center text-[13px] uppercase gap-3 tracking-[1px] font-medium`}>
              {savedTab ? savedIconFill : savedIconOutline} saved</span>

            <span className="py-3 flex items-center text-gray-400 text-[13px] uppercase gap-3 tracking-[1px] font-medium">
              {reelsIcon} reels</span>
            <span className="py-3 hidden sm:flex items-center text-gray-400 text-[13px] uppercase gap-3 tracking-[1px] font-medium">
              {taggedIcon} tagged</span>
          </div>

          {/* posts grid data */}


          {savedTab ? (
            <>
              {isLoadingMySavedPost ? <SpinLoader /> : (
                (mySavedPost && mySavedPost.response && mySavedPost.response.myPosts.length > 0) ? (
                  <PostContainerUser posts={mySavedPost.response.myPosts} />
                ) : (
                  <div className='bg-white text-center mt-2 p-4 text-xl rounded'>
                    Sorry, no posts have been Saved yet😩
                    <div className='flex items-center justify-center gap-3 mt-2'>
                      <span> You be the first Save Post</span>
                    </div>
                  </div>
                )
              )}
            </>
          ) : (
            <>
              {isLoading ? <SpinLoader /> : (
                (myPost && myPost.response && myPost.response.allPosts.length > 0) ? (
                  <PostContainerUser posts={myPost.response.allPosts} />
                ) : (
                  <div className='bg-white text-center mt-2 p-4 text-xl rounded'>
                    Sorry, no posts have been registered yet😩
                    <div className='flex items-center justify-center gap-3 mt-2'>
                      <span> You be the first</span>
                      <div onClick={() => setNewPost(true)} className="cursor-pointer">{postUploadOutline}</div>
                    </div>
                    <NewPost newPost={newPost} setNewPost={setNewPost} />
                  </div>
                )
              )}
            </>
          )}

        </div>
        <div className="bg-white mt-2 mb-10 drop-shadow-sm rounded flex sm:flex-row flex-col sm:gap-0 gap-5 sm:p-0 p-4 items-center justify-between">
          <img draggable="false" className="w-2/5 rounded-l" src="https://www.instagram.com/static/images/mediaUpsell.jpg/6efc710a1d5a.jpg" alt="" />
          <div className="mx-auto flex flex-col items-center">
            <h4 className="font-medium text-lg sm:text-xl">Start capturing and sharing your moments.</h4>
            <p>Get the app to share your first photo or video.</p>
          </div>

        </div>
      </div>
    </>
  )
}

export default Profile