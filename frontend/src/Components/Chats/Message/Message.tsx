import React from "react"
import { IMessage } from "../../../Page/Inbox/Inbox"
import { formatTime } from "../../../utils/formatTime";



type MessageProps = { message: IMessage, ownMsg: boolean }



const Message = (props: MessageProps) => {

    console.log(props);


    return (
        props.ownMsg ?
            props.message.content === '❤️' ?
                <span className="self-end text-4xl">{props.message.content}</span>
                :
                <div className="self-end flex flex-col gap-1.5 text-sm text-white bg-violet-600 px-4 py-3 rounded-3xl max-w-xs">
                    <span >{props.message.content}</span>
                    <span className="text-xs self-end">{formatTime(props.message.timestamp)}</span>
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
                        <div className="px-4 flex flex-col gap-1.5 py-3 text-sm bg-gray-200 rounded-3xl max-w-xs overflow-hidden">
                            <span className="">{props.message.content}</span>
                            <span className="text-xs text-gray-500">{formatTime(props.message.timestamp)}</span>
                        </div>
                    </div>
                </div>
    )
}

export default Message