import { Dialog } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { closeIcon } from '../../SvgIcon/SvgIcon'

type MessageEditedProps = {
    showEditMessageBox: boolean,
    setShowEditMessageBox: (value: boolean) => void,
    msgContent: string,
    msgId: string,
    handleEditMessage: (msgId: string, newContent: string) => void
}

function MessageEdited({ handleEditMessage, showEditMessageBox, setShowEditMessageBox, msgContent, msgId }: MessageEditedProps) {

    const [newMessage, setNewMessage] = useState(msgContent);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [])


    const submitHandler = () => {
        if (newMessage.trim()) {
            handleEditMessage(msgId, newMessage)
            setShowEditMessageBox(false)
        }
    }


    return (
        <Dialog open={showEditMessageBox} onClose={() => setShowEditMessageBox(false)} maxWidth='xl'>
            <div className="bg-white py-3 border-b px-4 flex justify-between w-full">
                <span className="font-medium">Edit Your Message</span>
                <button onClick={() => setShowEditMessageBox(false)} className="font-medium w-5 h-5">{closeIcon}</button>
            </div>
            <div className="flex flex-col xl:w-screen max-w-4xl my-2">
                <form onSubmit={e => e.preventDefault()} className='flex flex-col gap-2 px-4'>
                    <textarea ref={inputRef} className='border border-gray-500 p-3 font-medium rounded text-gray-500' placeholder='Write...' defaultValue={newMessage} onChange={(e) => setNewMessage(e.target.value)}>
                    </textarea>
                    <button onClick={submitHandler} className='font-medium py-2 rounded text-white w-full  duration-300 transition-all bg-primary-blue hover:bg-primaryhover-blue'>
                        Submit
                    </button>
                </form>
            </div>
        </Dialog>
    )
}

export default MessageEdited