import React, { Fragment, useState } from 'react'
import DateConverter from '../../utils/DateConverter';
import { userInformation } from '../../hooks/user/user.types';
import useGetData from '../../hooks/useGetData';
import { Rating } from '@mui/material';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import usePostData from '../../hooks/usePostData';
import { response } from '../User/TableTicket/TableTicket';
import { ticketUser } from '../../hooks/ticket/tickets.types';

type ResponseTicketProps = {
    readOnlyStars: boolean;
    bgInputAdmin: boolean;
    infoMessageUser: ticketUser;
    answerInfo: response[] | null; // Use 'Response[]' as this matches the state array
    setAnswerInfo: (value: (prev: response[] | null) => response[]) => void; // Use function signature for updating state
};

function ResponseTicket({
    readOnlyStars,
    bgInputAdmin,
    infoMessageUser,
    answerInfo,
    setAnswerInfo }: ResponseTicketProps) {


    const [message, setMessage] = useState('');
    const [rating, setRating] = useState<number | undefined>(undefined);
    const queryClient = useQueryClient();

    const { data: myInfo, isSuccess: isSuccessMyInfo } = useGetData<userInformation>(
        ["getMyUserInfo"],
        "users/user-information"
    );


    const { mutate: addNewMessage } = usePostData(
        `ticket/respond-ticket`,
        "Message send successfuly",
        true,
        () => {
            setMessage("")
            queryClient.invalidateQueries(["getUserTicket"])
            queryClient.invalidateQueries(["useGetAllTicket"])
        }
    );

    const { mutate: addRating } = usePostData(
        'ticket/add-rating',
        "Rating send successfuly",
        true,
        () => {
            queryClient.invalidateQueries(["getUserTicket"])
            queryClient.invalidateQueries(["useGetAllTicket"])
        }
    );

    // send ticket message
    const sendMessageHandler = () => {
        if (message.trim().length >= 5 && message.trim().length <= 60) {
            if (infoMessageUser?._id) {
                let newObjectSendMessage = {
                    ticketId: infoMessageUser?._id,
                    message: message
                }
                addNewMessage(newObjectSendMessage)

                if (myInfo && isSuccessMyInfo) {
                    setAnswerInfo((prev) => [
                        ...(prev || []),
                        {
                            senderId: myInfo._id,
                            senderUsername: myInfo.username,
                            message: message,
                            responseDate: new Date(),
                            senderProfilePicture: {
                                path: myInfo.profilePicture.path,
                                filename: myInfo.profilePicture.filename
                            }
                        }
                    ]);
                }
            }
        } else {
            toast.error("The description must be at least 20 characters and most 60 characters.")
        }
    }

    return (
        <>
            {myInfo?._id === infoMessageUser.user.userId ? (
                <div className="self-end flex flex-col p-2">
                    <div className="flex justify-between items-start text-white bg-violet-600 rounded-3xl max-w-[260px] px-4  py-3 overflow-hidden">
                        <div className=" flex  flex-col gap-1.5 text-sm ">
                            <span className='text-sm font-sans text-wrap'>{infoMessageUser?.description}</span>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs"><DateConverter date={infoMessageUser?.createdAt} /></span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-end gap-2 max-w-xs p-2">
                    <img draggable="false" className="w-7 h-7 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${infoMessageUser.user.profilePicture.filename}`} alt="prof" />
                    <div className="flex flex-col ">
                        <span className="text-xs text-gray-500 px-3 py-1">{infoMessageUser.user.username}</span>
                        <div className="flex flex-col">
                            <div className="px-4  flex flex-col gap-1.5 py-3 text-sm bg-gray-200 rounded-3xl max-w-[260px] overflow-hidden">
                                <span className="text-black text-sm font-sans text-wrap">{infoMessageUser.description}</span>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-gray-500"><DateConverter date={infoMessageUser.createdAt} /></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {answerInfo?.map(((data, index) => (
                <Fragment key={index}>
                    {myInfo?._id === data.senderId ? (
                        <div className="self-end flex flex-col p-2">
                            <div className="flex justify-between items-start text-white bg-violet-600 rounded-3xl max-w-[260px] px-4 py-3 overflow-hidden">
                                <div className=" flex flex-col gap-1.5 text-sm">
                                    <p className='text-sm font-sans text-wrap'>{data.message}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs"><DateConverter date={data.responseDate} /></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (

                        <div className="flex items-end gap-2 max-w-xs p-2">
                            <img draggable="false" className="w-7 h-7 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${data.senderProfilePicture.filename}`} alt="prof" />
                            <div className="flex flex-col ">
                                <span className="text-xs text-gray-500 px-3 py-1">{data.senderUsername} ( {infoMessageUser?.department} )</span>
                                <div className="flex flex-col">
                                    <div className="px-4  flex flex-col gap-1.5 py-3 text-sm bg-gray-200 rounded-3xl max-w-[260px] overflow-hidden">
                                        <span className="text-black text-sm font-sans text-wrap">{data.message}</span>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-gray-500"><DateConverter date={data.responseDate} /></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Fragment>
            )))}

            {infoMessageUser?.status !== "Closed" ? (
                <form onSubmit={e => e.preventDefault()} className="flex items-center mt-auto gap-3 justify-between border rounded-full py-2.5 px-4 m-5 relative">

                    <input
                        className={`flex-1 outline-none text-sm ${bgInputAdmin ? "bg-transparent text-white" : "bg-white dark:bg-black text-black dark:text-white"}  `}
                        type="text"
                        placeholder="Message..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        required
                    />
                    {message.trim().length > 0 &&
                        <button onClick={sendMessageHandler} className="text-primary-blue font-sans text-sm">Send</button>
                    }
                </form>
            ) : (
                <div className="flex items-end gap-2 max-w-xs p-2">
                    <div className='w-7 h-7'>

                    </div>
                    <div className="flex flex-col ">
                        <div className="flex flex-col">
                            <div className="px-4  flex flex-col gap-1.5 py-3 text-sm bg-red-400/30 rounded-3xl max-w-xs overflow-hidden">
                                <span className="dark:text-gray-200 text-slate-600 text-sm font-sans text-wrap">
                                    This ticket is closed, but please rate the admins' response. 😩</span>
                                {readOnlyStars ? (
                                    <Rating
                                        name="simple-controlled"
                                        value={+infoMessageUser.rating || 0}
                                        readOnly={true}
                                    />
                                ) : (
                                    <Rating
                                        name="simple-controlled"
                                        value={rating || +infoMessageUser.rating || 0} // Provide a default value if infoMessageUser.rating is undefined
                                        onChange={(event, newValue) => {
                                            setRating(newValue || 0); // Provide a default value if newValue is undefined
                                            if (infoMessageUser?._id && newValue !== null) {
                                                let newObjectAddRating = {
                                                    ticketId: infoMessageUser._id,
                                                    rating: newValue.toString() // Ensure newValue is a number
                                                };
                                                addRating(newObjectAddRating);
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ResponseTicket