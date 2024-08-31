import React from "react"
import { message } from "../../../hooks/message/message.types"

type MessageProps ={message : message , ownMsg: boolean}



const Message = (props: MessageProps) => {


    return (
        props.ownMsg ?
            props.message.message === '❤️' ?
                <span className="self-end text-4xl">{props.message.message}</span>
                :
                <span className="self-end text-sm text-white bg-violet-600 px-4 py-3 rounded-3xl max-w-xs">{props.message.message}</span>
            :
            props.message.message === '❤️' ?
                <div className="flex items-end gap-2 max-w-xs">
                    <img draggable="false" className="w-7 h-7 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${props.message.toUserId.profilePicture.filename}`} alt="profile" />
                    <span className="items-end text-4xl">{props.message.message}</span>
                </div>
                :
                <div className="flex items-end gap-2 max-w-xs">
                    <img draggable="false" className="w-7 h-7 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${props.message.fromUserId.profilePicture.filename}`} alt="profile" />
                    <span className="px-4 py-3 text-sm bg-gray-200 rounded-3xl max-w-xs overflow-hidden">{props.message.message}</span>
                </div>
    )
}

export default Message