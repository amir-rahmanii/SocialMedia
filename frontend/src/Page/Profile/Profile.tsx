import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/AuthContext'
import MetaData from '../../Components/MetaData/MetaData'
import { Link, useParams } from 'react-router-dom'
import { changeProfilePicture, metaballsMenu, postsIconFill, postsIconOutline, postUploadOutline, reelsIcon, savedIconFill, savedIconOutline, settingsIcon, taggedIcon } from '../../Components/SvgIcon/SvgIcon'
import Header from '../../Parts/Header/Header'
import { useGetMySavedPost } from '../../hooks/post/usePost'
import PostContainerUser from '../../Components/User/PostContainerUser/PostContainerUser'
import SpinLoader from '../../Components/SpinLoader/SpinLoader'
import NewPost from '../../Components/Header/NewPost/NewPost'
import { useGetUserData, useGetUserInformation, usePostFollowToggle } from '../../hooks/user/useUser'
import toast from 'react-hot-toast'
import ChangeProfile from '../../Components/User/ChangeProfile/ChangeProfile'
import ShowWhoFollow from '../../Components/Profile/ShowWhoFollow/ShowWhoFollow'



function Profile() {
  const [followed, setFollowed] = useState(false)
  const [isShowFollowers, setIsShowFollowers] = useState(false)
  const [isShowFollowing, setIsShowFollowing] = useState(false)
  const [savedTab, setSavedTab] = useState(false);
  const [newPost, setNewPost] = useState(false);
  const [isShowChangeProfile, setIsShowChangeProfile] = useState(false);

  // const navigate = useNavigate()


  const authContext = useContext(AuthContext);
  const param = useParams();
  const { userid } = param;

  const { data: mySavedPost, isLoading: isLoadingMySavedPost } = useGetMySavedPost();
  const { mutate: followToggle, isSuccess: isSuccessFollowToggle, isError: isErrorFollowToggle, error: errorFollow, data: dataFollow } = usePostFollowToggle();

  const Myuserid = localStorage.getItem("userId")
  //this is for my user
  const { data: informationMyUser, isSuccess: isSuccessInformationUser} = useGetUserInformation(Myuserid as string);

  //this is for all users data
  const { data: informationUserData, isLoading: isLoadingUserData , isSuccess : isSucessGetUserData} = useGetUserData(userid as string);


  useEffect(() => {
    if(isSucessGetUserData){
      const userid = localStorage.getItem("userId");
      let isFollowed = informationUserData?.user.followers.some(user => user.userId === userid);
      setFollowed(isFollowed)
    }
  }, [isSucessGetUserData])
  



  useEffect(() => {
    const tab = localStorage.getItem("tab");
    if (tab === "mySavedPosts") {
      setSavedTab(true)
    } else {
      setSavedTab(false)
    }

  }, [isShowChangeProfile])









  useEffect(() => {
    localStorage.setItem("tab", savedTab ? "mySavedPosts" : "myPosts")
  }, [savedTab])

  
  useEffect(() => {
    if (isSuccessInformationUser && informationMyUser) {
      authContext?.setUser(informationMyUser?.response.user)
    }
  }, [isSuccessInformationUser, informationMyUser])


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








  return (
    <>
      <MetaData title={`Profile • Instagram photos and videos`} />
      <Header />
      {isLoadingUserData ? (
        <SpinLoader />
      ) : (
        <div className="mt-16 xl:w-2/3 mx-auto p-3">


          <div className="sm:flex w-full sm:py-8 bg-white rounded-t">

            {/* profile picture */}
            <div className="sm:w-1/3 flex justify-center mx-auto sm:mx-0">
              <img draggable="false" className="w-40 h-40 border-2 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${informationUserData?.user.profilePicture.filename}`} alt="profile" />


              {authContext?.user?._id === informationUserData?.user._id && (
                <>
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
                </>
              )}



            </div>

            {/* profile details */}
            <div className="flex flex-col gap-6 p-4 sm:w-2/3 sm:p-1">
              <div className="flex items-center gap-8 sm:justify-start justify-between">

                <h2 className="text-2xl sm:text-3xl font-thin">{informationUserData?.user.username}</h2>

                <div className="flex gap-3 items-center">
                  <Link to="/accounts/edit" className="border font-medium hover:bg-gray-50 text-sm rounded px-2 py-1">Edit Profile</Link>
                  <Link to="/accounts/edit">{settingsIcon}</Link>
                </div>

                {informationUserData?.user._id !== authContext?.user?._id && (
                  <div className="flex gap-3 items-center">

                      <button onClick={() => {
                        setFollowed(prev => !prev);
                        followToggle(informationUserData?.user._id as string)
                      }} className="font-medium transition-all duration-300 hover:bg-primaryhover-blue bg-primary-blue text-sm text-white hover:shadow rounded px-6 py-1.5">{followed ? "UnFollow" : "Follow"}</button>
                  </div>
                )}

              </div>

              <div className="flex justify-between items-center max-w-[21.5rem]">
                <div className="cursor-pointer"><span className="font-semibold">

                  {informationUserData?.posts.length}
                </span> posts</div>
                <div className="cursor-pointer" onClick={() => setIsShowFollowers(true)}><span className="font-semibold">{informationUserData?.user.followers.length}</span> followers</div>

                {isShowFollowers && (
                  <ShowWhoFollow title="Followed" dataFollow={informationUserData?.user.followers} isOpenShowWhoFollow={isShowFollowers} setIsOpenShowWhoFollow={setIsShowFollowers} />
                )}

                <div className="cursor-pointer" onClick={() => setIsShowFollowing(true)}><span className="font-semibold">{informationUserData?.user.following.length}</span> following</div>
                {isShowFollowing && (
                  <ShowWhoFollow title="Following" dataFollow={informationUserData?.user.following} isOpenShowWhoFollow={isShowFollowing} setIsOpenShowWhoFollow={setIsShowFollowing} />
                )}

              </div>

              {/* bio */}
              <div className="max-w-full">
                <p className="font-medium">{informationUserData?.user.name}</p>
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

              {authContext?.user?._id === informationUserData?.user._id && (
                <span onClick={() => setSavedTab(true)} className={`${savedTab ? 'border-t border-black' : 'text-gray-400'} py-3 cursor-pointer flex items-center text-[13px] uppercase gap-3 tracking-[1px] font-medium`}>
                  {savedTab ? savedIconFill : savedIconOutline} saved</span>
              )}

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
                {isLoadingMySavedPost ? <SpinLoader /> : (
                  (informationUserData && informationUserData.posts && informationUserData.posts.length > 0) ? (
                    <PostContainerUser posts={informationUserData?.posts} />
                  ) : (
                    <div className='bg-white text-center mt-2 p-4 text-xl rounded'>
                      Sorry, no posts have been registered yet😩
                      {authContext?.user?._id === informationUserData?.user._id && (
                        <>
                          <div className='flex items-center justify-center gap-3 mt-2'>
                            <span> You be the first</span>
                            <div onClick={() => setNewPost(true)} className="cursor-pointer">{postUploadOutline}</div>
                          </div>
                          <NewPost newPost={newPost} setNewPost={setNewPost} />
                        </>
                      )}
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
      )}

    </>
  )
}

export default Profile