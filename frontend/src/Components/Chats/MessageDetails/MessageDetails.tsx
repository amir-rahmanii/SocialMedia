import { ClickAwayListener } from '@mui/material'
import React, { useState } from 'react'
import { deleteIcon, editPostIcon } from '../../SvgIcon/SvgIcon'
import MessageEdited from '../MessageEdited/MessageEdited'

type MessageDetailsProps = {
    msgId: string,
    setShowDetailsMessage: (value: boolean) => void,
    handleDeleteMessage: (msgId: string) => void,
    setShowEditMessageBox: (value: boolean) => void
}

function MessageDetails({ msgId, setShowEditMessageBox , setShowDetailsMessage, handleDeleteMessage }: MessageDetailsProps) {



    return (
        <>
            <ClickAwayListener onClickAway={() => setShowDetailsMessage(false)}>
                <div className="absolute -rotate-90 w-36 bg-white rounded top-10 -left-6 drop-shadow z-30 border">
                    <div className="flex flex-col w-full overflow-hidden rounded">
                        <div onClick={() => handleDeleteMessage(msgId)} className="flex bg-red-500 text-white items-center justify-between p-2.5 text-sm pl-4 cursor-pointer font-semibold hover:bg-red-400 duration-300 transition-all">
                            Delete
                            <div className='w-4 h-4'>
                                {deleteIcon}
                            </div>
                        </div>
                        <div onClick={() => {
                            setShowEditMessageBox(true)
                        }} className="flex bg-green-500 text-white items-center justify-between p-2.5 text-sm pl-4 cursor-pointer font-semibold hover:bg-green-400 duration-300 transition-all">
                            Edit
                            <div className='w-4 h-4 text-white'>
                                {editPostIcon}
                            </div>
                        </div>
                    </div>
                </div>
            </ClickAwayListener>
        </>
    )
}

export default MessageDetails