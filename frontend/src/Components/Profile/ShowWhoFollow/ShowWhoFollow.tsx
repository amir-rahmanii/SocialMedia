import React from 'react'
import { closeIcon } from '../../SvgIcon/SvgIcon'
import { Dialog } from '@mui/material'
import { Link } from 'react-router-dom'
import DateConverter from '../../../utils/DateConverter'

type ShowWhoFollowProps = {
  isOpenShowWhoFollow: boolean,
  setIsOpenShowWhoFollow: (value: boolean) => void,
  title : string,
  dataFollow?: {
    profilePicture: { path: string };
    userId: string;
    username: string;
  }[];
}

function ShowWhoFollow({title , dataFollow, isOpenShowWhoFollow, setIsOpenShowWhoFollow }: ShowWhoFollowProps) {
  return (
    <Dialog open={isOpenShowWhoFollow} onClose={() => setIsOpenShowWhoFollow(false)} maxWidth='xl'>
      <div className="flex flex-col xl:w-screen max-w-xl bg-white">
        <div className="bg-white py-3 border-b px-4 flex justify-between w-full">
          <span className="font-medium">List Users {title}</span>
          <button className='w-5 h-5' onClick={() => setIsOpenShowWhoFollow(false)}>
            {closeIcon}
          </button>
        </div>
        {dataFollow && (
          <>
          {dataFollow.length > 0 ? (
            <div className='py-3 px-4 flex flex-col'>
              {dataFollow?.map((data, index) => (
                <div key={index} className='flex items-center gap-2  border-b p-2'>
                  <Link to={`/profile/${data.userId}`}>
                    <img draggable="false" className="h-8 w-8 rounded-full shrink-0 object-cover mr-0.5" src={`http://localhost:4002/${data.profilePicture.path}`} alt="avatar" />
                  </Link>
                  <div className='flex flex-col'>
                    <Link to={`/profile/${data.userId}`} className="text-sm font-semibold hover:underline">{data.username}</Link>
                    {/* <p className='text-xs text-gray-500"'><DateConverter date={data.createdAt} /></p> */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='py-3 px-4 text-xl'>
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