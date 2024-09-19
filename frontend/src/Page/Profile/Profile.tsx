import React, { useEffect, useState } from 'react'
import MetaData from '../../Components/MetaData/MetaData'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { changeProfilePicture, postsIconFill, postsIconOutline, postUploadOutline, reelsIcon, savedIconFill, savedIconOutline, settingsIcon, taggedIcon } from '../../Components/SvgIcon/SvgIcon'
import Header from '../../Parts/Header/Header'
import PostContainerUser from '../../Components/User/PostContainerUser/PostContainerUser'
import SpinLoader from '../../Components/SpinLoader/SpinLoader'
import NewPost from '../../Components/Home/NewPost/NewPost'
import ChangeProfile from '../../Components/User/ChangeProfile/ChangeProfile'
import { Dialog } from '@mui/material'
import StoryContent from '../../Components/Home/StoriesContainer/StoryContent'
import SideBarLeft from '../../Parts/SideBarLeft/SideBarLeft'
import SideBarBottom from '../../Parts/SideBarBottom/SideBarBottom'
import ShowDialogModal from '../../Components/ShowDialogModal/ShowDialogModal'
import { useQueryClient } from 'react-query'
import usePostData from '../../hooks/usePostData'
import useGetData from '../../hooks/useGetData'
import { profile, userInformation } from '../../hooks/user/user.types'
import { Post } from '../../hooks/post/post.types'




function Profile() {
  const { userId } = useParams<string>();



  const [followed, setFollowed] = useState(false)
  const [isShowFollowers, setIsShowFollowers] = useState(false)
  const [isShowFollowing, setIsShowFollowing] = useState(false)
  const [savedTab, setSavedTab] = useState(false);
  const [newPost, setNewPost] = useState(false);
  const [isShowChangeProfile, setIsShowChangeProfile] = useState(false);
  const [isShowProfile, setIsShowProfile] = useState(false);
  const [isShowStoryContent, setIsShowStoryContent] = useState(false);
  const [followedList, setFollowedList] = useState<string[]>([])





  const queryClient = useQueryClient();
  const { mutate: followToggle } = usePostData("users/followToggle"
    , "User Followed/UnFollowed succesfuly!",
    false,
    () => {
      queryClient.invalidateQueries(["getMyUserInfo"]);
    }
  );

  const { data: mySavedPost, isLoading: isLoadingMySavedPost } = useGetData<Post[]>(
    ['mySavedPost'],
    'posts/my-save-posts'
  );

  //this is for all users data
  const { data: informationUserData, isLoading: isLoadingUserData, isSuccess: isSucessGetUserData, isError } = useGetData<profile>(
    ['getUserData', userId as string],
    `users/user-allData/${userId}`,
  );


  const { data: myInfo, isLoading: isLoadingMyInfo, isSuccess: isSuccessMyInfo } = useGetData<userInformation>(
    ["getMyUserInfo"],
    "users/user-information"
  );

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


            <div className="sm:flex w-full sm:py-8 rounded-t">

              {/* profile picture */}
              <div className="sm:w-1/3 pt-3 md:pt-0 flex justify-center mx-auto sm:mx-0">
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
                  src={`http://localhost:4002/images/profiles/${informationUserData?.user.profilePicture.filename}`}
                  alt="profile"
                />


                {myInfo?._id === informationUserData?.user._id && (
                  <>
                    <button onClick={() => setIsShowChangeProfile(true)} className=' flex flex-col items-center group self-end cursor-pointer'>
                      <div className='flex flex-col items-center'>
                        <div className='w-10 h-10 text-black dark:text-white hover:w-12 hover-h-12 transition-all duration-300'>
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
                  <img draggable="false" className="w-60 h-60 border-none rounded-full border-2 object-cover" src={`http://localhost:4002/images/profiles/${informationUserData?.user.profilePicture.filename}`} alt="profile" />
                </div>
              </Dialog>


              {/* profile details */}
              <div className="flex flex-col gap-6 p-4 sm:w-2/3 sm:p-1">
                <div className="flex items-end gap-8 sm:justify-start justify-between">

                  <h2 className="text-2xl sm:text-3xl font-thin text-black dark:text-white">{informationUserData?.user.username}</h2>

                  {myInfo?._id === informationUserData?.user._id && (
                    <div>
                      <Link to="/update-password" className="text-black dark:text-white border flex gap-2 items-center font-medium hover:bg-[#00376b1a] dark:hover:bg-[#e0f1ff21] transition-all duration-300 text-sm rounded px-2 py-1">Change Password {settingsIcon}</Link>
                    </div>
                  )}



                </div>

                <div className="flex justify-between items-center max-w-[21.5rem] text-black dark:text-white">
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
                                      <img draggable="false" className="h-12 w-12 rounded-full shrink-0 object-cover mr-0.5" src={`http://localhost:4002/${data.profilePicture.path}`} alt="avatar" />
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
                                        className="font-medium transition-all duration-300 hover:bg-primaryhover-blue bg-primary-blue text-sm text-white hover:shadow rounded px-6 py-1.5"
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
                                      <img draggable="false" className="h-12 w-12 rounded-full shrink-0 object-cover mr-0.5" src={`http://localhost:4002/${data.profilePicture.path}`} alt="avatar" />
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
                                        className="font-medium transition-all duration-300 hover:bg-primaryhover-blue bg-primary-blue text-sm text-white hover:shadow rounded px-6 py-1.5"
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
                  <p className="font-medium">{informationUserData?.user.name}</p>
                  <p className="whitespace-pre-line">Lorem ipsum</p>

                  <a href={"https://chatgpt.com/"} target="_blank" className="text-blue-900 font-medium">{new URL("https://chatgpt.com/c/b972c579-d4f1-4075-8a2c-c5a11bbbc486").hostname}</a>

                </div>

                {informationUserData?.user._id !== myInfo?._id && (
                  <button onClick={() => {
                    setFollowed(prev => !prev);
                    const objFollow = {
                      userIdToFollow: informationUserData?.user._id
                    }
                    followToggle(objFollow);
                  }} className=" sm:max-w-[21.5rem] font-medium transition-all duration-300 hover:bg-primaryhover-blue bg-primary-blue text-sm text-white hover:shadow rounded py-1.5">{followed ? "UnFollow" : "Follow"}</button>
                )}
              </div>

            </div>



            <div className="border-t dark:border-gray-300/20 border-gray-300  rounded-b">

              {/* tabs */}
              <div className="flex gap-12 justify-center text-black dark:text-white">
                <span onClick={() => {
                  setSavedTab(false)
                }} className={`${savedTab ? 'text-gray-400' : 'border-t border-black dark:border-white'} py-3 cursor-pointer  flex items-center text-[13px] uppercase gap-3 tracking-[1px] font-medium`}>
                  {savedTab ? postsIconOutline : postsIconFill} posts</span>

                {myInfo?._id === informationUserData?.user._id && (
                  <span onClick={() => {
                    setSavedTab(true)
                  }} className={`${savedTab ? 'border-t border-black dark:border-white' : 'text-gray-400'} py-3 cursor-pointer flex items-center text-[13px] uppercase gap-3 tracking-[1px] font-medium`}>
                    {savedTab ? savedIconFill : savedIconOutline} saved</span>
                )}

                <span className="py-3 flex items-center text-gray-400 text-[13px] uppercase gap-3 tracking-[1px] font-medium">
                  <div className='w-4 h-4 text-gray-400'>
                    {reelsIcon}
                  </div>
                  reels</span>
                <span className="py-3 hidden sm:flex items-center text-gray-400 text-[13px] uppercase gap-3 tracking-[1px] font-medium">
                  {taggedIcon} tagged</span>
              </div>

              {/* posts grid data */}


              {savedTab ? (
                <>
                  {isLoadingMySavedPost ? <SpinLoader /> : (
                    (mySavedPost && mySavedPost.length > 0) ? (
                      <PostContainerUser showCol={true} posts={mySavedPost} />
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
                      <PostContainerUser showCol={true} posts={informationUserData?.posts} />
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
            <div className="text-black dark:text-white mt-10 mb-10 drop-shadow-sm rounded flex sm:flex-row flex-col sm:gap-0 gap-5 sm:p-0 p-4 items-center justify-between">
              <div className='grid grid-cols-3 gap-2'>
                {Array(9).fill(0).map((_, index) => (
                  <img key={index + 1} loading='lazy' draggable="false" className="rounded w-28 h-28" src="/src/assets/images/4.jpg" alt="1" />
                ))}

              </div>
              <div className="mx-auto flex flex-col items-center">
                <h4 className="font-medium text-lg sm:text-xl">Start capturing and sharing your moments.</h4>
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