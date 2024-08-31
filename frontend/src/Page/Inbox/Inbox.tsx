import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../../Components/Home/Sidebar/Sidebar'
import MetaData from '../../Components/MetaData/MetaData'
import EmojiPicker from '@emoji-mart/react';
import { useSocket } from '../../Context/SocketContext';
import { useGetAllMessages } from '../../hooks/message/useMessage';
import SpinLoader from '../../Components/SpinLoader/SpinLoader';
import Message from '../../Components/Chats/Message/Message';
import { useGetAllUsersInformation, useGetUserData, useGetUserInformation } from '../../hooks/user/useUser';
import SkeletonUserItem from '../../Components/User/SkeletonUserItem/SkeletonUserItem';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { allMessage, message } from '../../hooks/message/message.types';

function Inbox() {
    const location = useLocation();
    const [message, setMessage] = useState("");
    const [allMessagesLocal, setAllMessagesLocal] = useState<allMessage>([]);
    // const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    // const socket = useRef(null);

    // const [typing, setTyping] = useState(false);
    // const [isTyping, setIsTyping] = useState(false);
    // const [typingData, setTypingData] = useState({});

    const [showEmojis, setShowEmojis] = useState(false);

    const [showSearch, setShowSearch] = useState(false);
    const { socket, onlineUsers, userOnline, sendMessage } = useSocket();
    const navigate = useNavigate();

    const openModal = () => {
        setShowSearch(true);
    }





    // const handleModalClose = () => {
    //     setShowSearch(false);
    // }






    const searchParams = new URLSearchParams(location.search);
    const toUserId = searchParams.get('toUserId') || '';

    const { data: myInformationData, isLoading: isLoadingToGetUserInformation } = useGetUserInformation();

    const { data: allMessage, isLoading, refetch: refetchAllMessage } = useGetAllMessages(myInformationData?.response.user._id as string, toUserId);

    const { data: informationAllUser, isLoading: isLoadingInformationAllUser } = useGetAllUsersInformation();

    const { data: informationUserData, isSuccess: isSucessGetUserData } = useGetUserData(toUserId);



    const toUserIdHandler = (id: string) => {
        const toUserId = new URLSearchParams(window.location.search);
        toUserId.set('toUserId', id);
        navigate({ search: toUserId.toString() });
    }


    useEffect(() => {
        refetchAllMessage();

    }, [toUserId, allMessage])

    useEffect(() => {
        if (allMessage) {
            setAllMessagesLocal(allMessage);
        }
    }, [allMessage]);



    //if user onlined show btn green
    // useEffect(() => {
    //     if (socket) {
    //       console.log("Setting up socket listener");
      
    //       // Listener for onlineUsers
    //       socket.on("onlineUsers", (users) => {
    //         console.log("Received onlineUsers event:", users);
    //         userOnline(users);
    //       });
      
    //       // Listener for receiveMessage
    //       socket.on("receiveMessage", (message) => {
    //         console.log("Received message:", message);
    //         // Handle received message
    //       });
      
    //       // Emit userOnline event
    //       if (myInformationData?.response.user._id) {
    //         socket.emit("userOnline", myInformationData.response.user._id);
    //       }
      
    //       // Clean up
    //       return () => {
    //         if (socket) {
    //           console.log("Cleaning up socket listener");
    //           socket.off("onlineUsers");
    //           socket.off("receiveMessage");
    //         }
    //       };
    //     }
    //   }, [socket, myInformationData]);
      


    // send message user
    const sendMessageHandler = () => {
        if (socket && message.trim() !== '' && toUserId) {
            const newMessage: message = {
                _id: crypto.randomUUID(),
                createdAt: new Date(),
                fromUserId: {
                    _id: myInformationData?.response.user._id || '',
                    username: myInformationData?.response.user.username || '',
                    profilePicture: myInformationData?.response.user.profilePicture || { path: '', filename: '' },
                },
                toUserId: {
                    _id: toUserId,
                    username: informationUserData?.user._id || '',
                    profilePicture: myInformationData?.response.user.profilePicture || { path: '', filename: '' },
                },
                isRead: false,
                sentAt: new Date(),
                updatedAt: new Date(),
                message: message,
            };

            setAllMessagesLocal(prevMessages => [...prevMessages, newMessage]);

            sendMessage(myInformationData?.response.user._id as string, toUserId, message);

            setMessage('');
        } else {
            toast.error("Invalid toUserId or message is empty");
        }
    };





    return (
        <>
            <MetaData title="Instagram • Direct" />

            <div className="mt-14 sm:mt-[4.7rem] pb-4 rounded h-[90vh] xl:w-2/3 mx-auto sm:pr-14 sm:pl-8">
                <div className="flex border h-full rounded w-full bg-white">
                    <div className="flex flex-col w-full sm:w-4/6 gap-2 border-2">
                        {isLoadingInformationAllUser ? (
                            Array(5).fill("").map((el, i) => (<SkeletonUserItem key={i} />))
                        ) : (
                            <div className='flex flex-col gap-1 p-2'>
                                {informationAllUser?.response?.users?.map((data) => (
                                    <div key={data._id}>
                                        {myInformationData?.response.user._id !== data._id && (
                                            <div onClick={() => toUserIdHandler(data._id)} className='flex items-center justify-between border-b pb-2.5'>
                                                <div className='flex items-center gap-2'>
                                                    <Link to={`/profile/${data._id}`}>
                                                        <img draggable="false" className="h-8 w-8 rounded-full shrink-0 object-cover mr-0.5" src={`http://localhost:4002/images/profiles/${data.profilePicture.filename}`} alt="avatar" />
                                                    </Link>
                                                    <div className='flex flex-col'>
                                                        <Link to={`/profile/${data._id}`} className="text-sm font-semibold hover:underline">{data.username}</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {isSucessGetUserData ? (
                        <div className="flex flex-col justify-between w-full sm:w-4/6">

                            {/* header */}
                            <div className="flex py-3 px-6 border-b items-center justify-between">
                                <div className="flex gap-2 items-center">
                                    <div className="w-8 h-8 relative">
                                        <img draggable="false" className="w-7 h-7 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${informationUserData.user.profilePicture.filename}`} alt="profile" />

                                        {/* {onlineUsers[informationUserData.user._id] && (
                                            <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 bg-green-500 rounded-full"></div>
                                        )} */}
                                    </div>
                                    <span className="font-medium cursor-pointer">{informationUserData.user.username}</span>
                                </div>
                                <svg className="cursor-pointer" aria-label="View Thread Details" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle><circle cx="11.819" cy="7.709" r="1.25"></circle><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="10.569" x2="13.432" y1="16.777" y2="16.777"></line><polyline fill="none" points="10.569 11.05 12 11.05 12 16.777" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline></svg>
                            </div>

                            {/* messages */}
                            <div className="w-full flex-1 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden p-4">

                                {isLoading && isLoadingToGetUserInformation ? <SpinLoader /> :
                                    allMessagesLocal?.map((m) => (
                                        <React.Fragment key={m._id}>

                                            <Message ownMsg={m.fromUserId._id === myInformationData?.response.user._id} message={m} />
                                            <div ref={scrollRef}></div>
                                        </React.Fragment>
                                    ))
                                }
                                {/* {isTyping &&
                            <>
                                <div className="flex items-center gap-3 max-w-xs">
                                    <img draggable="false" loading="lazy" className="w-7 h-7 rounded-full object-cover" src={friend.avatar} alt="avatar" />
                                    <span className="text-sm text-gray-500">typing...</span>
                                </div>
                                <div ref={scrollRef}></div>
                            </>
                        } */}
                            </div>

                            {/* message input */}
                            <form onSubmit={e => e.preventDefault()} className="flex items-center gap-3 justify-between border rounded-full py-2.5 px-4 m-5 relative">
                                <span onClick={() => setShowEmojis(!showEmojis)} className="cursor-pointer hover:opacity-60">
                                    <svg aria-label="Emoji" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-6.5 1.167a1.167 1.167 0 10-1.166 1.167 1.167 1.167 0 001.166-1.167zm5.163 3.24a3.406 3.406 0 01-4.982.007 1 1 0 10-1.557 1.256 5.397 5.397 0 008.09 0 1 1 0 00-1.55-1.263zM12 .503a11.5 11.5 0 1011.5 11.5A11.513 11.513 0 0012 .503zm0 21a9.5 9.5 0 119.5-9.5 9.51 9.51 0 01-9.5 9.5z"></path></svg>
                                </span>

                                {showEmojis && (
                                    <div className="absolute bottom-14 -left-10">
                                        <EmojiPicker
                                            set="google"
                                            onSelect={(e: any) => setMessage(message + e.native)}
                                            title="Emojis"
                                        />
                                    </div>
                                )}

                                <input
                                    className="flex-1 outline-none text-sm"
                                    type="text"
                                    placeholder="Message..."
                                    value={message}
                                    onFocus={() => setShowEmojis(false)}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                                {message.trim().length > 0 ?
                                    <button onClick={sendMessageHandler} className="text-primary-blue font-medium text-sm">Send</button>
                                    :
                                    <>
                                        <svg className="cursor-pointer" aria-label="Add Photo or Video" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M6.549 5.013A1.557 1.557 0 108.106 6.57a1.557 1.557 0 00-1.557-1.557z" fillRule="evenodd"></path><path d="M2 18.605l3.901-3.9a.908.908 0 011.284 0l2.807 2.806a.908.908 0 001.283 0l5.534-5.534a.908.908 0 011.283 0l3.905 3.905" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path><path d="M18.44 2.004A3.56 3.56 0 0122 5.564h0v12.873a3.56 3.56 0 01-3.56 3.56H5.568a3.56 3.56 0 01-3.56-3.56V5.563a3.56 3.56 0 013.56-3.56z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                        <svg className="hover:opacity-70 cursor-pointer" aria-label="Like" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path></svg>
                                    </>
                                }
                            </form>

                        </div>
                    ) : (
                        <p>selected a chat please</p>
                    )}


                </div>

                {/* <SearchModal open={showSearch} onClose={handleModalClose} /> */}

            </div>
        </>
    )
}

export default Inbox