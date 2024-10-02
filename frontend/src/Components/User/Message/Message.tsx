import React, { useEffect, useRef, useState } from "react"
import { IMessage } from "../../../Page/Inbox/Inbox"
import { formatTime } from "../../../utils/formatTime";
import { deleteIcon, editPostIcon, moreIcons } from "../../SvgIcon/SvgIcon";
import ShowDialogModal from "../../ShowDialogModal/ShowDialogModal";
import { TextField } from "@mui/material";



type MessageProps = {
    message: IMessage,
    ownMsg: boolean,
    handleLikeMessage: (msgId: string) => void,
    handleDeleteMessage: (msgId: string) => void,
    handleEditMessage: (msgId: string, newContent: string) => void
}



const Message = (props: MessageProps) => {

    const [showDetailsMessage, setShowDetailsMessage] = useState(false);
    const [showEditMessageBox, setShowEditMessageBox] = useState(false);

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const [newMessage, setNewMessage] = useState(props.message.content);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, [])


    const submitHandler = () => {
        if (newMessage.trim()) {
            props.handleEditMessage(props.message._id, newMessage)
            setShowEditMessageBox(false)
            setShowDetailsMessage(false)
        }
    }

    return (
        <>
            {
                props.ownMsg ?
                    props.message.content === '❤️' ?
                        <span className="self-end text-4xl">{props.message.content}</span>
                        :
                        <div className="self-end flex flex-col">
                            <div className="flex justify-between items-start text-white bg-violet-600 rounded-3xl max-w-xs px-4  py-3">
                                <div onDoubleClick={() => props.handleLikeMessage(props.message._id)} className=" flex cursor-pointer flex-col gap-1.5 text-sm ">
                                    <span >{props.message.content}</span>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs">{formatTime(props.message.timestamp)}</span>
                                        {props.message.isEdited && (
                                            <span className="text-xs ml-2">Edited</span>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => setShowDetailsMessage(true)} className="cursor-pointer relative rotate-90 text-white">
                                    {moreIcons}

                                </button>
                            </div>
                            {
                                props.message.likedBy.length > 0 &&
                                <div className="grid gap-[2px] py-[2px] auto-cols-max grid-flow-col">
                                    {props.message.likedBy.map(data => (
                                        <div className="flex items-center" key={data._id}>
                                            <img draggable="false" className="w-5 h-5 rounded-full object-cover" src={`${import.meta.env.VITE_API_BASE_URL}/${data.profilePicture.path}`} alt="p" />
                                            <span >
                                                ❤️
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    :
                    props.message.content === '❤️' ?
                        <div className="flex items-end gap-2 max-w-xs">
                            <img draggable="false" className="w-7 h-7 rounded-full object-cover" src={`${import.meta.env.VITE_API_BASE_URL}/${props.message?.sender?.profilePicture?.path}`} alt="p" />
                            <span className="items-end text-4xl">{props.message.content}</span>
                        </div>
                        :
                        <div className="flex items-end gap-2 max-w-xs">
                            <img draggable="false" className="w-7 h-7 rounded-full object-cover" src={`${import.meta.env.VITE_API_BASE_URL}/${props.message?.sender?.profilePicture?.path}`} alt="p" />
                            <div className="flex flex-col ">
                                <span className="text-xs text-gray-500 px-3 py-1">{props.message.sender.username}</span>
                                <div className="flex flex-col">
                                    <div onDoubleClick={() => props.handleLikeMessage(props.message._id)} className="px-4 cursor-pointer flex flex-col gap-1.5 py-3 text-sm bg-gray-200 rounded-3xl max-w-xs overflow-hidden">
                                        <span className="text-black">{props.message.content}</span>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-gray-500">{formatTime(props.message.timestamp)}</span>
                                            {props.message.isEdited && (
                                                <span className="text-xs text-gray-500 ml-2">Edited</span>
                                            )}
                                        </div>
                                    </div>
                                    {
                                        props.message.likedBy.length > 0 &&
                                        <div className="grid px-2 gap-[2px] py-[2px] auto-cols-max grid-flow-col">
                                            {props.message.likedBy.map(data => (
                                                <div className="flex items-center" key={data._id}>
                                                    <img draggable="false" className="w-5 h-5 rounded-full object-cover" src={`${import.meta.env.VITE_API_BASE_URL}/${data.profilePicture.path}`} alt="prof" />
                                                    <span >
                                                        ❤️
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
            }

            {/* DetailsMessage */}
            <ShowDialogModal
                isOpenShowLDialogModal={showDetailsMessage}
                setisOpenShowLDialogModal={setShowDetailsMessage}
                title="Details Message"
                height="h-auto"
            >
                <div className="flex flex-col w-full overflow-hidden rounded">
                    <div onClick={() => props.handleDeleteMessage(props.message._id)} className="flex bg-red-500 text-white items-center justify-between p-2.5 text-sm pl-4 cursor-pointer font-semibold hover:bg-red-400 duration-300 transition-all">
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
            </ShowDialogModal>

    
            {/* editMessage */}
            <ShowDialogModal
                isOpenShowLDialogModal={showEditMessageBox}
                setisOpenShowLDialogModal={setShowEditMessageBox}
                title="Edit Message Box"
                height="h-auto"
            >
                <form onSubmit={e => e.preventDefault()} className='flex mt-3 flex-col gap-2 px-4'>
                    <TextField
                        label="New Message"
                        name="New Message"
                        inputRef={textAreaRef}
                        className='border border-gray-500  font-sans rounded text-gray-500'
                        placeholder='Write...'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}>
                    </TextField>
                    <button onClick={submitHandler} className='font-sans py-2 rounded text-white w-full  duration-300 transition-all bg-primary-blue hover:bg-primaryhover-blue'>
                        Submit
                    </button>
                </form>
            </ShowDialogModal>
        </>
    )
}

export default Message