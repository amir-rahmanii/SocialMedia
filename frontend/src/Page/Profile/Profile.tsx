import React, { useEffect, useState } from 'react'
import MetaData from '../../Components/MetaData/MetaData'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { postsIconOutline, postUploadOutline, reelsIcon, savedIconFill, savedIconOutline, settingsIcon, taggedIcon, photosIcon } from '../../Components/SvgIcon/SvgIcon'
import PostContainerUser from '../../Components/User/PostContainerUser/PostContainerUser'
import SpinLoader from '../../Components/SpinLoader/SpinLoader'
import { Dialog } from '@mui/material'
import ShowDialogModal from '../../Components/ShowDialogModal/ShowDialogModal'
import usePostData from '../../hooks/usePostData'
import useGetData from '../../hooks/useGetData'
import { profile, userInformation } from '../../hooks/user/user.types'
import { Post } from '../../hooks/post/post.types'
import SideBarLeft from '../../Parts/User/SideBarLeft/SideBarLeft'
import Header from '../../Parts/User/Header/Header'
import SideBarBottom from '../../Parts/User/SideBarBottom/SideBarBottom'
import StoryContent from '../../Components/User/StoriesContainer/StoryContent'
import NewPost from '../../Components/User/NewPost/NewPost'
import resizeImage from '../../utils/resizeImage'




function Profile() {
  const { userId } = useParams<string>();
  const [followed, setFollowed] = useState(false)
  const [isShowFollowers, setIsShowFollowers] = useState(false)
  const [isShowFollowing, setIsShowFollowing] = useState(false)
  const [savedTab, setSavedTab] = useState(false);
  const [newPost, setNewPost] = useState(false);
  const [isShowProfile, setIsShowProfile] = useState(false);
  const [isShowStoryContent, setIsShowStoryContent] = useState(false);
  const [followedList, setFollowedList] = useState<string[]>([])




  const { mutate: followToggle } = usePostData("users/followToggle"
    , "User Followed/UnFollowed succesfuly!",
    false,
    () => {
      refetchGetData();
      refetchMyInfo();
    }
  );

  const { data: mySavedPost, isLoading: isLoadingMySavedPost, refetch: refetchMySavedPost } = useGetData<Post[]>(
    ['mySavedPost'],
    'posts/my-save-posts'
  );

  //this is for all users data
  const { data: informationUserData, isLoading: isLoadingUserData, isSuccess: isSucessGetUserData, isError, refetch: refetchGetData } = useGetData<profile>(
    ['getUserData'],
    `users/user-allData/${userId}`
  );


  const { data: myInfo, isLoading: isLoadingMyInfo, isSuccess: isSuccessMyInfo, refetch: refetchMyInfo } = useGetData<userInformation>(
    ["getMyUserInfo"],
    "users/user-information"
  );

  const { mutate: updateProfilePicture } = usePostData('users/update-profile-picture'
    , 'Profile picture updated successfuly!'
    , true,
    () => {
      refetchGetData();
      refetchMyInfo();
    }, true);



  const navigate = useNavigate(); // Initialize useNavigate





  // Function to handle story click and update URL with storyid as a query parameter
  const handleStoryClick = (storyId: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('storyid', storyId);
    navigate({ search: searchParams.toString() });
  };


  useEffect(() => {
    if (userId) {
      setSavedTab(false);
      setIsShowFollowers(false);
      setIsShowFollowing(false);
      refetchGetData()
    }
  }, [userId]);





  useEffect(() => {
    if (isSucessGetUserData && isSuccessMyInfo) {
      let isFollowed = myInfo?.following.some(user => user.userId === informationUserData?.user._id)
      if (isFollowed) {
        setFollowed(isFollowed)
      } else {
        setFollowed(false)
      }
    }
  }, [isSucessGetUserData, isSuccessMyInfo])


  // Check if the user is followed
  useEffect(() => {
    if (myInfo && isSuccessMyInfo) {
      const followedUserIds = myInfo.following.map(follow => follow.userId);
      setFollowedList(followedUserIds);
    }
  }, [isSuccessMyInfo, myInfo]);







  useEffect(() => {
    const tab = localStorage.getItem("tab");
    if (tab === "mySavedPosts") {
      setSavedTab(true)
    } else {
      setSavedTab(false)
    }

  }, [])



  const fileChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imgFile = e.target.files[0];

      try {
        const resizedImage = await resizeImage(imgFile, 300, 300); // Resizing to 300x300
        const formData = new FormData();
        formData.append('profilePicture', resizedImage);
        updateProfilePicture(formData);
      } catch (error) {
        console.error('Error resizing image:', error);
      }
    }
  };







  useEffect(() => {
    localStorage.setItem("tab", savedTab ? "mySavedPosts" : "myPosts")
  }, [savedTab])




  return (
    <>
      <SideBarLeft />
      <Header />
      {isError ? (
        <div className='text-black dark:text-white text-4xl flex justify-center items-center h-screen'>
          Sorry, the user was not found. Please try again 😩
        </div>
      ) :
        isLoadingUserData && isLoadingMyInfo ? (
          <SpinLoader />
        ) : (
          <div className="md:w-2/3 md:mr-32 mt-14 md:mt-0 mx-auto p-3">
            <MetaData title={`@${myInfo?.username} • Instagram photos and videos`} />


            <div className="flex flex-col gap-6 sm:gap-0 items-center sm:items-stretch sm:flex-row w-full py-6 sm:py-8 rounded-t">

              {/* profile picture */}
              <div className="relative shrink-0 mx-16 flex justify-center">
                <img
                  onClick={() => {
                    if (informationUserData && informationUserData?.stories.length > 0) {
                      setIsShowStoryContent(true);
                      handleStoryClick(informationUserData?.stories[0]._id);
                    } else {
                      setIsShowProfile(true);
                    }
                  }}
                  draggable="false"
                  className={`${(informationUserData && informationUserData?.stories.length > 0) ? "border-red-500" : ""} w-32 h-32 lg:w-40 lg:h-40 border-2 rounded-full object-cover`}
                  src={`${import.meta.env.VITE_API_BASE_URL}/${informationUserData?.user.profilePicture.path}`}
                  alt="profile"
                />


                {myInfo?._id === informationUserData?.user._id && (
                  <>
                    <button className='absolute bottom-0 sm:bottom-14 md:bottom-16 lg:bottom-9 right-0'>
                      <label htmlFor="profile" className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2">
                        <div className='bg-[#4E60E2] hover:scale-110 transition-all duration-300 rounded-full w-[34px] h-[34px] flex items-center justify-center'>
                          {photosIcon}
                        </div>
                        <input onChange={fileChangeHandler} type="file" name="profile" id="profile" className="sr-only" />
                      </label>
                    </button>
                  </>
                )}
              </div>

              {(isShowStoryContent && isSucessGetUserData) && (
                <StoryContent
                  setIsShowStoryContent={setIsShowStoryContent}
                  isShowStoryContent={isShowStoryContent}
                  allStories={{ stories: informationUserData?.stories || [] }}
                />
              )}

              {/* is showing profile picture */}
              <Dialog open={isShowProfile} onClose={() => setIsShowProfile(false)} maxWidth='xl'>
                <div className="bg-gradient-to-r p-2 from-[#833ab4] via-[#fd1d1d] to-[#fcb045]">
                  <img draggable="false" className="w-60 h-60 border-none rounded-full border-2 object-cover" src={`${import.meta.env.VITE_API_BASE_URL}/${informationUserData?.user.profilePicture.path}`} alt="profile" />
                </div>
              </Dialog>


              {/* profile details */}
              <div className="flex flex-col gap-6 sm:w-2/3 sm:p-1">
                <div className="flex items-start gap-8 sm:justify-start justify-between">

                  <h2 className="text-2xl sm:text-3xl font-thin text-black dark:text-white">{informationUserData?.user.username}</h2>

                  {myInfo?._id === informationUserData?.user._id && (
                    <div>
                      <Link to="/update-password" className="text-black dark:text-white border flex gap-2 items-center font-sans hover:bg-[#00376b1a] dark:hover:bg-[#e0f1ff21] transition-all duration-300 text-sm rounded px-2 py-2">Change Password {settingsIcon}</Link>
                    </div>
                  )}



                </div>

                <div className="flex justify-between gap-3 items-center max-w-[21.5rem] text-black dark:text-white">
                  <div className="cursor-pointer"><span className="font-semibold ">

                    {informationUserData?.posts.length}
                  </span> posts</div>
                  <div className="cursor-pointer" onClick={() => setIsShowFollowers(true)}><span className="font-semibold">{informationUserData?.user.followers.length}</span> followers</div>

                  {/* show follower */}
                  {isShowFollowers && (
                    <ShowDialogModal
                      isOpenShowLDialogModal={isShowFollowers}
                      setisOpenShowLDialogModal={setIsShowFollowers}
                      title="List User Followers"
                      height='h-72'
                    >
                      {informationUserData?.user.followers && (
                        <>
                          {informationUserData?.user.followers.length > 0 ? (
                            <div className='py-3 px-4 flex flex-col '>
                              {informationUserData?.user.followers?.map((data, index) => (
                                <div key={index} className='flex justify-between items-center'>
                                  <div key={index} className='flex items-center gap-2 p-2'>
                                    <Link to={`/profile/${data.userId}`}>
                                      <img draggable="false" className="h-12 w-12 rounded-full shrink-0 object-cover mr-0.5" src={`${import.meta.env.VITE_API_BASE_URL}/${data.profilePicture.path}`} alt="avatar" />
                                    </Link>
                                    <div className='flex flex-col'>
                                      <Link to={`/profile/${data.userId}`} className="text-black dark:text-white text-sm font-semibold hover:underline">{data.username}</Link>
                                      {/* <p className='text-xs text-gray-500"'><DateConverter date={data.createdAt} /></p> */}
                                    </div>
                                  </div>
                                  <div className='ml-5'>
                                    {myInfo?._id !== data.userId && (
                                      <button
                                        onClick={() => {
                                          const objFollow = {
                                            userIdToFollow: data.userId
                                          }
                                          followToggle(objFollow);
                                        }}
                                        className="font-sans transition-all duration-300 hover:bg-primaryhover-blue bg-primary-blue text-sm text-white hover:shadow rounded px-6 py-1.5"
                                      >
                                        {followedList.includes(data.userId) ? "UnFollow" : "Follow"}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className='py-3 text-black dark:text-white px-4 text-xl'>
                              No user found 😩
                            </div>
                          )}
                        </>
                      )}
                    </ShowDialogModal>
                  )}

                  <div className="cursor-pointer" onClick={() => setIsShowFollowing(true)}><span className="font-semibold">{informationUserData?.user.following.length}</span> following</div>
                  {/* show following */}
                  {isShowFollowing && (
                    <ShowDialogModal
                      isOpenShowLDialogModal={isShowFollowing}
                      setisOpenShowLDialogModal={setIsShowFollowing}
                      title="List User Following"
                      height='h-72'
                    >
                      {informationUserData?.user.following && (
                        <>
                          {informationUserData?.user.following.length > 0 ? (
                            <div className='py-3 px-4 flex flex-col '>
                              {informationUserData?.user.following?.map((data, index) => (
                                <div key={data._id} className='flex justify-between items-center'>
                                  <div key={index} className='flex items-center gap-2 p-2'>
                                    <Link to={`/profile/${data.userId}`}>
                                      <img draggable="false" className="h-12 w-12 rounded-full shrink-0 object-cover mr-0.5" src={`${import.meta.env.VITE_API_BASE_URL}/${data.profilePicture.path}`} alt="avatar" />
                                    </Link>
                                    <div className='flex flex-col'>
                                      <Link to={`/profile/${data.userId}`} className="text-black dark:text-white text-sm font-semibold hover:underline">{data.username}</Link>
                                      {/* <p className='text-xs text-gray-500"'><DateConverter date={data.createdAt} /></p> */}
                                    </div>
                                  </div>
                                  <div className='ml-5'>
                                    {myInfo?._id !== data.userId && (
                                      <button
                                        onClick={() => {
                                          const objFollow = {
                                            userIdToFollow: data.userId
                                          }
                                          followToggle(objFollow);
                                        }}
                                        className="font-sans transition-all duration-300 hover:bg-primaryhover-blue bg-primary-blue text-sm text-white hover:shadow rounded px-6 py-1.5"
                                      >
                                        {followedList.includes(data.userId) ? "UnFollow" : "Follow"}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className='py-3 text-black dark:text-white px-4 text-xl'>
                              No user found 😩
                            </div>
                          )}
                        </>
                      )}
                    </ShowDialogModal>
                  )}

                </div>

                {/* bio */}
                <div className="max-w-full text-black dark:text-white">
                  <p className="font-sans">{informationUserData?.user.name}</p>
                  <p className="whitespace-pre-line">Lorem ipsum</p>

                  <a href={"https://chatgpt.com/"} target="_blank" className="text-blue-900 font-sans">{new URL("https://chatgpt.com/c/b972c579-d4f1-4075-8a2c-c5a11bbbc486").hostname}</a>

                </div>

                {informationUserData?.user._id !== myInfo?._id && (
                  <button onClick={() => {
                    setFollowed(prev => !prev);
                    const objFollow = {
                      userIdToFollow: informationUserData?.user._id
                    }
                    followToggle(objFollow);
                  }} className=" sm:max-w-[21.5rem] font-sans transition-all duration-300 hover:bg-primaryhover-blue bg-primary-blue text-sm text-white hover:shadow rounded py-1.5">{followed ? "UnFollow" : "Follow"}</button>
                )}
              </div>

            </div>



            <div className="border-t dark:border-gray-300/20 border-gray-300  rounded-b">

              {/* tabs */}
              <div className="flex gap-12 justify-center text-black dark:text-white">
                <span onClick={() => {
                  setSavedTab(false)
                }} className={`${savedTab ? 'text-gray-400' : 'border-t border-black dark:border-white'} py-3 cursor-pointer  flex items-center text-[13px] uppercase gap-3 tracking-[1px] font-sans`}>
                  {postsIconOutline} posts</span>

                {myInfo?._id === informationUserData?.user._id && (
                  <span onClick={() => {
                    setSavedTab(true)
                  }} className={`${savedTab ? 'border-t border-black dark:border-white' : 'text-gray-400'} py-3 cursor-pointer flex items-center text-[13px] uppercase gap-3 tracking-[1px] font-sans`}>
                    {savedTab ? savedIconFill : savedIconOutline} saved</span>
                )}

                <span className="py-3 flex items-center text-gray-400 text-[13px] uppercase gap-3 tracking-[1px] font-sans">
                  <div className='w-4 h-4 text-gray-400'>
                    {reelsIcon}
                  </div>
                  reels</span>
                <span className="py-3 hidden sm:flex items-center text-gray-400 text-[13px] uppercase gap-3 tracking-[1px] font-sans">
                  {taggedIcon} tagged</span>
              </div>

              {/* posts grid data */}


              {savedTab ? (
                <>
                  {isLoadingMySavedPost ? <SpinLoader /> : (
                    (mySavedPost && mySavedPost.length > 0) ? (
                      <PostContainerUser
                        refetchMySavedPost={refetchMySavedPost}
                        refetchGetData={refetchGetData}
                        showCol={true}
                        posts={mySavedPost} 
                        />
                    ) : (
                      <div className='text-black dark:text-white text-center mt-2 p-4 text-xl rounded'>
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
                      <PostContainerUser
                        refetchMySavedPost={refetchMySavedPost}
                        refetchGetData={refetchGetData}
                        showCol={true}
                        posts={informationUserData?.posts} />
                    ) : (
                      <div className='text-black dark:text-white text-center mt-2 p-4 text-xl rounded'>
                        Sorry, no posts have been registered yet😩
                        {myInfo?._id === informationUserData?.user._id && (
                          <>
                            <div className='flex items-center justify-center gap-3 mt-2'>
                              <span> You be the first</span>
                              <div onClick={() => setNewPost(true)} className="cursor-pointer w-6 h-6 text-black dark:text-white">{postUploadOutline}</div>
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
            {/* login info user */}
            {/* <div className='mt-4'>
            {myInformationData?.response.user._id === informationUserData?.user._id && (
              <TableLogin loginInformation={myInformationData?.response?.user.systemInfos} />
            )}
          </div> */}

            {/* footer */}
            <div className="text-black dark:text-white mt-10 mb-10 drop-shadow-sm rounded flex lg:flex-row flex-col sm:gap-0 gap-5 sm:p-0 p-4 items-center justify-between">
              <div className='grid grid-cols-3 gap-2'>
                {Array(9).fill(0).map((_, index) => (
                  <img key={index + 1} loading='lazy' draggable="false" className="rounded w-28 h-28" src="/images/4.jpg" alt="1" />
                ))}

              </div>
              <div className="mx-auto flex flex-col items-center">
                <h4 className="font-sans text-lg sm:text-xl text-center">Start capturing and sharing your moments.</h4>
                <p>Get the app to share your first photo or video.</p>
              </div>

            </div>
          </div>
        )
      }

      <SideBarBottom />

    </>
  )
}

export default Profile