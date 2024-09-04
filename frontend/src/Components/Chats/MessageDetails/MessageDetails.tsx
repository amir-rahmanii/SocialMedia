import { ClickAwayListener } from '@mui/material'
import React from 'react'
import { deleteIcon } from '../../SvgIcon/SvgIcon'

type MessageDetailsProps = {
    msgId : string,
    setShowDetailsMessage : (value : boolean) => void,
    handleDeleteMessage : (msgId : string) => void
}

function MessageDetails({msgId , setShowDetailsMessage , handleDeleteMessage} : MessageDetailsProps) {
    return (
        <ClickAwayListener onClickAway={() => setShowDetailsMessage(false)}>
            <div className="absolute -rotate-90 w-36 bg-white rounded top-10 -left-2 drop-shadow z-30 border">
                <div className="flex flex-col w-full overflow-hidden rounded">
                    <div onClick={() => handleDeleteMessage(msgId)} className="flex bg-red-500 text-white items-center justify-between p-2.5 text-sm pl-4 cursor-pointer font-semibold hover:bg-red-400 duration-300 transition-all">
                        Delete
                        <div className='w-4 h-4'>
                            {deleteIcon}
                        </div>
                    </div>
                </div>
            </div>
        </ClickAwayListener>
    )
}

export default MessageDetails