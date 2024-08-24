import { Dialog } from '@mui/material'
import React from 'react'
import DateConverter from '../../utils/DateConverter'

type ShowWhoLikedProps = {
    isOpenShowLiked: boolean,
    setIsOpenShowLiked: (value: boolean) => void,
    userLiked: {
        createdAt: Date,
        postid: string,
        updatedAt: Date,
        username: string,
        userid: string,
        _id: string,
    }[]
}


function ShowWhoLiked({ userLiked, isOpenShowLiked, setIsOpenShowLiked }: ShowWhoLikedProps) {
    return (
        <Dialog open={isOpenShowLiked} onClose={() => setIsOpenShowLiked(false)} maxWidth='xl'>
            <div className="flex flex-col xl:w-screen max-w-xl bg-white">
                <div className="bg-white py-3 border-b px-4 flex justify-between w-full">
                    <span className="font-medium">List Users Liked</span>
                    <button onClick={() => setIsOpenShowLiked(false)}>
                        close
                    </button>
                </div>
                {userLiked.length > 0 ? (
                <div className='py-3 px-4 flex flex-col'>
                    {userLiked.map((data , index) => (
                        <div key={index} className='flex items-center gap-2  border-b p-2'>
                            <img draggable="false" className="h-8 w-8 rounded-full shrink-0 object-cover mr-0.5" src={`/src/assets/images/hero.png`} alt="avatar" />
                            <div className='flex flex-col'>
                                <p className="text-sm font-semibold hover:underline">{data.username}</p>
                                <p className='text-xs text-gray-500"'><DateConverter date={data.createdAt}/></p>
                            </div>
                        </div>
                    ))}
                </div>
                ) : (
                    <div className='py-3 px-4 text-xl'>
                        No one has liked this post 😩
                    </div>
                )}
            </div>
        </Dialog>
    )
}

export default ShowWhoLiked