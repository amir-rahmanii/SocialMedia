import React, { useContext, useEffect, useRef, useState } from 'react'
import MetaData from '../../Components/MetaData/MetaData'
import EmojiPicker from '@emoji-mart/react';
import SpinLoader from '../../Components/SpinLoader/SpinLoader';
import Message from '../../Components/Chats/Message/Message';
import io, { Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import Header from '../../Parts/Header/Header';
import SideBarLeft from '../../Parts/SideBarLeft/SideBarLeft';
import { emojiIcon } from '../../Components/SvgIcon/SvgIcon';
import { AuthContext } from '../../Context/AuthContext';
import { useGetMyUsersInfo } from '../../hooks/user/useUser';



// تعریف تایپ‌ها برای داده‌های پیام
export interface IMessage {
    _id: string,
    sender: {
        _id: string;
        username: string;
        profilePicture: {
            path: string;
            filename: string
        };
    };
    isEdited: boolean;
    content: string;
    timestamp: string;
    likedBy: {
        _id: string;
        username: string;
        profilePicture: {
            path: string;
            filename: string
        }
    }[]
}

// تعریف تایپ برای داده‌های ورودی کاربر
interface IUserMessage {
    senderId: string;
    content: string;
}

// url base socket
const socketURL = 'http://localhost:4002';

function Inbox() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [message, setMessage] = useState("");
    const [allMessages, setAllMessages] = useState<IMessage[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [countUsersOnline, setCountUsersOnline] = useState(0)
    const [backgroundColorChat, setBackgroundColorChat] = useState(
        localStorage.getItem("chatBg") || "#FFFFFF"
    )
    const authContext = useContext(AuthContext);
    const [showEmojis, setShowEmojis] = useState(false);

    const { data: myInfo, isSuccess, isError } = useGetMyUsersInfo();

    useEffect(() => {
        if (isSuccess) {
            authContext?.setUser(myInfo);
        } else if (isError) {
            toast.error("please try again later 😩")
        }
    }, [isSuccess, isError]);




    useEffect(() => {
        const newSocket = io(socketURL);
        setSocket(newSocket);
        // اطمینان از برقراری اتصال سوکت
        newSocket.on("connect", () => {
            console.log("Connected to the server");

            // دریافت پیام‌های اولیه از سرور
            newSocket.on("initial messages", (initialMessages: IMessage[]) => {
                setAllMessages(initialMessages);
            });

            // گوش دادن به پیام‌های جدید
            newSocket.on("chat message", (msg: IMessage) => {
                setAllMessages(prevMessages => [...prevMessages, msg]);
            });

            newSocket.on("online users", (count: number) => {
                setCountUsersOnline(count)
            })

            newSocket.on('typing users', (users: string[]) => {
                setTypingUsers(users);
            });

            newSocket.on("message liked", ({ msgId, userId, username, profilePicture }) => {
                setAllMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg._id === msgId
                            ? {
                                ...msg,
                                likedBy: msg.likedBy.some(user => user._id === userId)
                                    ? msg.likedBy.filter(user => user._id !== userId)
                                    : [...msg.likedBy, { _id: userId, username, profilePicture }]
                            }
                            : msg
                    )
                );
            });

            newSocket.on("message deleted", (msgId) => {
                setAllMessages(prevMessages => prevMessages.filter(msg => msg._id !== msgId));
            });

            newSocket.on("message edited", (updatedMessage: IMessage) => {

                setAllMessages(prevMessages =>
                    prevMessages.map(msg =>
                        (msg._id === updatedMessage._id && msg.content !== updatedMessage.content)
                            ? {
                                ...msg,
                                isEdited: true,
                                content: updatedMessage.content
                            }
                            : msg
                    )
                );

            });

        });

        // مدیریت قطع اتصال و حذف شنوندگان
        return () => {
            newSocket.disconnect();
            newSocket.off("connect");
            newSocket.off("initial messages");
            newSocket.off("chat message");
            newSocket.off('typing users');
            newSocket.off("online users");
            newSocket.off("message liked");
            newSocket.off("message deleted");
            newSocket.off("message edited");
        };
    }, []);


    useEffect(() => {
        const typingTimeout = setTimeout(() => {
            setTypingUsers([]);
        }, 3000); // Adjust timeout as needed

        return () => clearTimeout(typingTimeout);
    }, [typingUsers]);





    //when you joined the chat scroll bottom
    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, [allMessages]);









    const sendMessageHandler = () => {
        if (authContext?.user && socket) {
            const messageData: IUserMessage = {
                senderId: authContext?.user?._id,
                content: message,
            };
              socket.emit("chat message", messageData);
              socket.emit('typing', { userId: authContext?.user?._id, username: authContext.user.username, isTyping: false });

        } else {
            toast.error("Sorry , try again later😩")
        }
        setMessage(""); // پاک کردن فیلد ورودی پس از ارسال پیام
    }

    const handleSubmitSendHeart = (e: React.MouseEvent<SVGSVGElement, MouseEvent>, msg: string) => {
        e.preventDefault();
        if (authContext?.user && socket) {
            const messageData: IUserMessage = {
                senderId: authContext?.user?._id,
                content: msg,
            };
             socket.emit("chat message", messageData);
        } else {
            toast.error("Sorry , try again later😩")
        }
    }

    const handleEmojiSelect = (emoji: any) => {
        setMessage(message + emoji.native)
    }

    const handleInputChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
        if (authContext?.user && socket) {
             socket.emit('typing', { userId: authContext?.user?._id, username: authContext.user.username, isTyping: e.target.value !== '' });
        } else {
            toast.error("Sorry , try again later😩")
        }
    }

    const handleLikeMessage = (msgId: string) => {
        if (authContext?.user && socket) {
             socket.emit("like message", { msgId, userId: authContext?.user?._id });
        } else {
            toast.error("Sorry , try again later😩")
        }
    };

    const handleDeleteMessage = (msgId: string) => {
        if(socket){
            socket.emit("delete message", msgId);
           toast.success("Msg Deleted Successfuly 😁")
        }else{
            toast.error("Sorry , try again later😩")
        }
    };

    const handleEditMessage = (msgId: string, newContent: string) => {
        if(socket){
            socket.emit("edit message", { msgId, newContent });
        }else{
            toast.error("Sorry , try again later😩")
        }
    }








    return (
        <>
            <MetaData title="Instagram • Direct" />
            <Header />
            <SideBarLeft />
            <div className="mt-14 xl:mr-32 pb-4 rounded h-[90vh] md:w-4/6 mx-auto bg-white dark:bg-black">
                <div className={`flex border dark:border-gray-300/20 border-gray-300 h-full rounded w-full`}>
                    {/* <div className="flex flex-col w-full sm:w-4/6 gap-2 border-2">
                        {isLoadingInformationAllUser ? (
                            Array(5).fill("").map((el, i) => (<SkeletonUserItem key={i} />))
                        ) : (
                            <div className='flex flex-col gap-1 p-2'>
                                {informationAllUser?.response?.users?.map((data) => (
                                    <div key={data._id}>
                                        {authContext?.user?._id !== data._id && (
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
                    </div> */}


                    <div className="flex flex-col justify-between w-full">

                        {/* header */}
                        <div className="flex py-3 px-6 border-b dark:border-gray-300/20 border-gray-300 items-center justify-between">
                            <div className="flex gap-2 items-center">
                                <div className="w-8 h-8 relative">
                                    <img draggable="false" className="w-7 h-7 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${authContext?.user?.profilePicture.filename}`} alt="profile" />

                                    {/* {onlineUsers[informationUserData.user._id] && (
                                            <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 bg-green-500 rounded-full"></div>
                                        )} */}
                                </div>
                                <div className='flex flex-col'>
                                    <span className="font-medium cursor-pointer text-black dark:text-white">Group Instagram</span>
                                    {authContext?.user && (
                                        (typingUsers.length > 0 && !typingUsers.includes(authContext.user.username)) ? (
                                            <span className="font-medium cursor-pointer text-xs text-gray-500">{typingUsers.join(', ')} is Typing...</span>
                                        ) : (
                                            <span className="font-medium cursor-pointer text-xs text-gray-500">{countUsersOnline} Users Online</span>
                                        )
                                    )}

                                </div>
                            </div>
                            <div className='flex items-center gap-1'>
                                <input className='rounded' onChange={(e) => {
                                    setBackgroundColorChat(e.target.value)
                                    localStorage.setItem("chatBg", e.target.value)
                                }} type="color" id="head" name="head" value={backgroundColorChat} />
                                <label className='hidden text-black dark:text-white sm:block font-medium cursor-pointer' htmlFor='head'>Change BackGround</label>
                            </div>
                        </div>

                        {/* messages */}
                        <div className="w-full flex-1 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden p-4" style={{ backgroundColor: backgroundColorChat }}>

                            {allMessages.length > 0 ? (
                                allMessages?.map((m) => (
                                    <React.Fragment key={m._id}>

                                        <Message handleEditMessage={handleEditMessage} handleDeleteMessage={handleDeleteMessage} handleLikeMessage={handleLikeMessage} ownMsg={m.sender._id === authContext?.user?._id} message={m} />
                                        <div ref={scrollRef}></div>
                                    </React.Fragment>
                                ))
                            ) : (
                                <SpinLoader />
                            )}
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
                            <span onClick={() => setShowEmojis(!showEmojis)} className="cursor-pointer text-black dark:text-white  w-6 h-6 hover:opacity-60">
                                {emojiIcon}
                            </span>

                            {showEmojis && (
                                <div className="absolute bottom-14 -left-5">
                                    <EmojiPicker
                                        set="google"
                                        title="Emojis"
                                        onEmojiSelect={handleEmojiSelect}
                                    />
                                </div>
                            )}

                            <input
                                className="flex-1 outline-none text-sm bg-white dark:bg-black text-black dark:text-white"
                                type="text"
                                placeholder="Message..."
                                value={message}
                                onFocus={() => setShowEmojis(false)}
                                onChange={handleInputChanges}
                                required
                            />
                            {message.trim().length > 0 ?
                                <button onClick={sendMessageHandler} className="text-primary-blue font-medium text-sm">Send</button>
                                :
                                <div className='text-black dark:text-white flex gap-2'>
                                    <svg className="cursor-pointer" aria-label="Add Photo or Video" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M6.549 5.013A1.557 1.557 0 108.106 6.57a1.557 1.557 0 00-1.557-1.557z" fillRule="evenodd"></path><path d="M2 18.605l3.901-3.9a.908.908 0 011.284 0l2.807 2.806a.908.908 0 001.283 0l5.534-5.534a.908.908 0 011.283 0l3.905 3.905" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path><path d="M18.44 2.004A3.56 3.56 0 0122 5.564h0v12.873a3.56 3.56 0 01-3.56 3.56H5.568a3.56 3.56 0 01-3.56-3.56V5.563a3.56 3.56 0 013.56-3.56z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                    <svg onClick={(e) => handleSubmitSendHeart(e, '❤️')} className="hover:opacity-70 cursor-pointer" aria-label="Like" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path></svg>
                                </div>
                            }
                        </form>

                    </div>



                </div>

                {/* <SearchModal open={showSearch} onClose={handleModalClose} /> */}

            </div>
        </>
    )
}

export default Inbox