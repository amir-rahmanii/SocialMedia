import React, { useState } from "react"
import { IMessage } from "../../../Page/Inbox/Inbox"
import { formatTime } from "../../../utils/formatTime";
import { moreIcons } from "../../SvgIcon/SvgIcon";
import MessageDetails from "../MessageDetails/MessageDetails";



type MessageProps = {
    message: IMessage,
    ownMsg: boolean,
    handleLikeMessage: (msgId: string) => void,
    handleDeleteMessage: (msgId: string) => void
}



const Message = (props: MessageProps) => {

    const [showDetailsMessage, setShowDetailsMessage] = useState(false);

    return (
        props.ownMsg ?
            props.message.content === '❤️' ?
                <span className="self-end text-4xl">{props.message.content}</span>
                :
                <div className="self-end flex flex-col">
                    <div className="flex justify-between items-start text-white bg-violet-600 rounded-3xl max-w-xs px-4  py-3">
                        <div onDoubleClick={() => props.handleLikeMessage(props.message._id)} className=" flex cursor-pointer flex-col gap-1.5 text-sm ">
                            <span >{props.message.content}</span>
                            <span className="text-xs self-end">{formatTime(props.message.timestamp)}</span>
                        </div>
                        <button onClick={() => setShowDetailsMessage(prev => !prev)} className="cursor-pointer relative rotate-90 text-white">
                            {moreIcons}
                            {showDetailsMessage && (
                                <MessageDetails setShowDetailsMessage={setShowDetailsMessage} handleDeleteMessage={props.handleDeleteMessage} msgId={props.message._id} />
                            )}
                        </button>
                    </div>
                    {
                        props.message.likedBy.length > 0 &&
                        <div className="grid gap-[2px] py-[2px] auto-cols-max grid-flow-col">
                            {props.message.likedBy.map(data => (
                                <div className="flex items-center" key={data._id}>
                                    <img draggable="false" className="w-5 h-5 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${data.profilePicture.filename}`} alt="p" />
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
                    <img draggable="false" className="w-7 h-7 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${props.message?.sender?.profilePicture?.filename}`} alt="p" />
                    <span className="items-end text-4xl">{props.message.content}</span>
                </div>
                :
                <div className="flex items-end gap-2 max-w-xs">
                    <img draggable="false" className="w-7 h-7 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${props.message?.sender?.profilePicture?.filename}`} alt="p" />
                    <div className="flex flex-col ">
                        <span className="text-xs text-gray-500 px-3 py-1">{props.message.sender.username}</span>
                        <div className="flex flex-col">
                            <div onDoubleClick={() => props.handleLikeMessage(props.message._id)} className="px-4 cursor-pointer flex flex-col gap-1.5 py-3 text-sm bg-gray-200 rounded-3xl max-w-xs overflow-hidden">
                                <span className="">{props.message.content}</span>
                                <span className="text-xs text-gray-500">{formatTime(props.message.timestamp)}</span>
                            </div>
                            {
                                props.message.likedBy.length > 0 &&
                                <div className="grid px-2 gap-[2px] py-[2px] auto-cols-max grid-flow-col">
                                    {props.message.likedBy.map(data => (
                                        <div className="flex items-center" key={data._id}>
                                            <img draggable="false" className="w-5 h-5 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${data.profilePicture.filename}`} alt="p" />
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
    )
}

export default Message