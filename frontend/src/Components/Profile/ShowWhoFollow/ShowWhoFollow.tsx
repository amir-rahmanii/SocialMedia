import React, { useContext, useEffect, useState } from 'react'
import { closeIcon } from '../../SvgIcon/SvgIcon'
import { Dialog } from '@mui/material'
import { Link } from 'react-router-dom'
import DateConverter from '../../../utils/DateConverter'
import { AuthContext } from '../../../Context/AuthContext'
import toast from 'react-hot-toast'
import { useGetMyUsersInfo, usePostFollowToggle } from '../../../hooks/user/useUser'

type ShowWhoFollowProps = {
  isOpenShowWhoFollow: boolean,
  setIsOpenShowWhoFollow: (value: boolean) => void,
  title: string,
  dataFollow?: {
    profilePicture: { path: string };
    userId: string;
    username: string;
  }[];
}

function ShowWhoFollow({ title, dataFollow, isOpenShowWhoFollow, setIsOpenShowWhoFollow }: ShowWhoFollowProps) {

  const { mutate: followToggle, isSuccess: isSuccessFollowToggle, isError: isErrorFollowToggle, error: errorFollow, data: dataFollowing } = usePostFollowToggle();
  const [followed, setFollowed] = useState<string[]>([])
  const { data: myInfo } = useGetMyUsersInfo();

  


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
      toast.success(dataFollowing.data.message,
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
    if (myInfo) {
        const followedUserIds = myInfo.following.map(follow => follow.userId);
        setFollowed(followedUserIds);
    }
}, [myInfo]);



  return (
    <Dialog open={isOpenShowWhoFollow} onClose={() => setIsOpenShowWhoFollow(false)} maxWidth='xl'>
      <div className="flex flex-col h-56 overflow-y-auto xl:w-screen max-w-xl bg-white dark:bg-black">
        <div className="bg-white dark:bg-black py-3 border-b dark:border-gray-300/20 border-gray-300  px-4 flex justify-between w-full">
          <span className="font-medium text-black dark:text-white">List Users {title}</span>
          <button className='w-6 h-6 text-black dark:text-white' onClick={() => setIsOpenShowWhoFollow(false)}>
            {closeIcon}
          </button>
        </div>
        {dataFollow && (
          <>
            {dataFollow.length > 0 ? (
              <div className='py-3 px-4 flex flex-col '>
                {dataFollow?.map((data, index) => (
                  <div className='flex justify-between items-center'>
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
                            followToggle(data.userId);
                          }}
                          className="font-medium transition-all duration-300 hover:bg-primaryhover-blue bg-primary-blue text-sm text-white hover:shadow rounded px-6 py-1.5"
                        >
                          {followed.includes(data.userId) ? "UnFollow" : "Follow"}
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
      </div>
    </Dialog>
  )
}

export default ShowWhoFollow