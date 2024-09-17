import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { commentIcon, deleteIcon, editPostIcon, emojiIcon, likeIconOutline, moreIcons, saveIconFill, saveIconOutline, shareIcon } from '../../SvgIcon/SvgIcon'
import { likeFill } from '../../SvgIcon/SvgIcon';
import EmojiPicker from '@emoji-mart/react';
import { PostItemProps } from '../PostsContainer/PostsContainer';
import DateConverter from '../../../utils/DateConverter';
import { useDeleteComment, useDeletePost, usePostAddComment, usePostLikeToggle, usePostSavePostToggle } from '../../../hooks/post/usePost';
import toast from 'react-hot-toast';
import Slider from "react-slick";
import ShowDialogModal from '../../ShowDialogModal/ShowDialogModal';
import { useGetMyUsersInfo, usePostFollowToggle } from '../../../hooks/user/useUser';
import UpdatePost from '../UpdatePost/UpdatePost';
import { AuthContext } from '../../../Context/AuthContext';


type likesProps = {
    createdAt: Date;
    postid: string;
    updatedAt: Date;
    username: string;
    userid: string;
    _id: string;
    userPicture: {
        path: string;
        filename: string;
    };
}[]



function PostItem(props: PostItemProps) {
    const commentInput = useRef<HTMLInputElement>(null);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [comment, setComment] = useState("");
    const [viewComment, setViewComment] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [likeEffect, setLikeEffect] = useState(false);
    const [showMoreDesc, setShowMoreDesc] = useState(false);
    const [isOpenShowLiked, setIsOpenShowLiked] = useState(false);
    const [postDatailsToggle, setPostDetailsToggle] = useState(false);
    const [updatePost, setUpdatePost] = useState(false)
    const { mutate: followToggle, isSuccess: isSuccessFollowToggle, isError: isErrorFollowToggle, error: errorFollow, data: dataFollow } = usePostFollowToggle();
    const [followedListUser, setFollowedListUser] = useState<string[]>([])
    const [listUserLiked, setListUserLiked] = useState<likesProps>(props.likes);
    const [listUserSaved, setListUserSaved] = useState<string[]>(props.saved);



    const { mutate: addPostLikeToggle } = usePostLikeToggle();
    const { mutate: addPostSaveToggle } = usePostSavePostToggle();
    const { mutate: addComment, isSuccess: isSuccessAddComment, isError: isErrorAddComment, error } = usePostAddComment();
    const { mutate: deleteComment, isSuccess: isSuccessDeleteComment, isError: isErroeDeleteComment, error: errorDeleteComment } = useDeleteComment();
    const { mutate: deletePost, isSuccess: isSuccessDeletePost, isError: isErrorDeletePost, error: errorDeletePost } = useDeletePost();
    const authContext = useContext(AuthContext);
    const { data: myInfo , isSuccess : isSuccessMyInfo , isError : isErrorMyInfo} = useGetMyUsersInfo();

    useEffect(() => {
        if (isSuccessMyInfo) {
            authContext?.setUser(myInfo);
        } else if (isErrorMyInfo) {
            toast.error("please try again later 😩")
        }
    }, [isSuccessMyInfo, isErrorMyInfo]);

    const deletePostHandler = (postId: string) => {
        let newObj = {
            postid: postId
        }
        deletePost(newObj)
    }


    useEffect(() => {
        if (isErrorDeletePost) {
            if (errorDeletePost && (errorDeletePost as any).response) {
                toast.error((errorDeletePost as any).response.data.error.message
                )
            }
        }

        if (isSuccessDeletePost) {
            toast.success("Post removed successfuly",

            )
        }
    }, [isErrorDeletePost, isSuccessDeletePost])

    const setLike = (postid: string) => {
        setLikeEffect(true)
        setTimeout(() => {
            setLikeEffect(false)
        }, 500)
        if (listUserLiked.some(id => props.user.id === id.userid)) {
            return;
        }
        handleLike(postid);
    }

    const handleLike = (postid: string) => {
        let newObjLikeToggle = {
            postid
        }
        addPostLikeToggle(newObjLikeToggle)

        if (authContext?.user) {
            const newObjUpdateUserLiked = {
                createdAt: new Date(),
                postid: postid,
                updatedAt: new Date(),
                username: authContext?.user?.username,
                userid: authContext?.user?._id,
                _id: crypto.randomUUID(),
                userPicture: {
                    path: authContext?.user?.profilePicture.path,
                    filename: authContext?.user?.profilePicture.filename
                }
            };


            if (liked) {
                let listUserLikedNew = [...listUserLiked]
                let listUserLikedNewFilter = listUserLikedNew.filter(data => data.username !== authContext?.user?.username);
                setListUserLiked(listUserLikedNewFilter)
            } else {
                setListUserLiked(prev => [...prev, newObjUpdateUserLiked])
            }
        } else {
            toast.error("please try again 😩")
        }

    }



    const handleSave = (postid: string) => {
        let newObjSaveToggle = {
            postid
        }
        addPostSaveToggle(newObjSaveToggle)
        if (authContext?.user) {
            if (saved) {
                let listUserSavedNew = [...listUserSaved]
                let listUserSavedNewFilter = listUserSavedNew.filter(data => data !== authContext?.user?._id);
                setListUserSaved(listUserSavedNewFilter)
            } else {
                setListUserSaved(prev => [...prev, authContext?.user?._id || ''])
            }
        }
        else {
            toast.error("please try again 😩")
        }
    }

    //for show liked
    useEffect(() => {
        if (authContext?.user) {
            let isLiked = listUserLiked.some(data => authContext?.user?.username === data.username);
            setLiked(isLiked);
        } else {
            toast.error("please try again 😩")
        }
    }, [listUserLiked])

    useEffect(() => {
        if (authContext?.user) {
            let isPosted = listUserSaved.some(data => authContext?.user?._id === data);
            setSaved(isPosted);
        } else {
            toast.error("please try again 😩")
        }
    }, [listUserSaved])

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };




    const handleEmojiSelect = (emoji: any) => {
        setComment(comment + emoji.native)
    }

    const submitComment = (postid: string) => {
        if(authContext?.user){
            let newObjAddComment = {
                postid,
                title: "title",
                content: comment
            }
    
            addComment(newObjAddComment);
        }
        setComment('')
    }

    useEffect(() => {
        if (isErrorAddComment) {
            if (error && (error as any).response) {
                toast.error((error as any).response.data.error.message
                )
            }
        }

        if (isSuccessAddComment) {
            toast.success("Comment Add successfuly",

            )
        }
    }, [isErrorAddComment, isSuccessAddComment])


    useEffect(() => {
        if (isErroeDeleteComment) {
            if (errorDeleteComment && (errorDeleteComment as any).response) {
                toast.error((errorDeleteComment as any).response.data.error.message
                )
            }
        }

        if (isSuccessDeleteComment) {
            toast.success("Comment removed successfuly",

            )
        }
    }, [isErroeDeleteComment, isSuccessDeleteComment])

    useEffect(() => {
        if (isErrorFollowToggle) {
            if (errorFollow && (errorFollow as any).response) {
                toast.error((errorFollow as any).response.data.error.message
                )
            }
        }

        if (isSuccessFollowToggle) {
            toast.success(dataFollow.data.message,

            )
        }
    }, [isErrorFollowToggle, isSuccessFollowToggle, dataFollow])


    // Check if the user is followed
    useEffect(() => {
        if (myInfo) {
            const followedUserIds = myInfo.following.map(follow => follow.userId);
            setFollowedListUser(followedUserIds);
        }
    }, [myInfo]);



    return (
        <div className="flex flex-col rounded bg-white dark:bg-black relative mt-3">

            <div className="flex justify-between px-3 py-2.5 border-b dark:border-gray-300/20 border-gray-300  items-center">
                <div className="flex space-x-3 items-center">
                    <Link to={`/profile/${props.user.id}`}><img draggable="false" className="w-10 h-10 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${props.user.userPicture.filename}`} alt="avatar" /></Link>
                    <Link to={`/profile/${props.user.id}`} className="text-black dark:text-white text-sm font-semibold">{props.user.username}</Link>
                </div>
                {authContext?.user?._id === props.user.id && (
                    <button onClick={() => setPostDetailsToggle(true)} className="cursor-pointer text-black dark:text-white">{moreIcons}</button>
                )}
            </div>

            {postDatailsToggle && (
                <ShowDialogModal
                    isOpenShowLDialogModal={postDatailsToggle}
                    setisOpenShowLDialogModal={setPostDetailsToggle}
                    title="Post Deatils"
                    height='h-auto'
                >
                    <div className="flex flex-col w-full overflow-hidden rounded">
                        {(authContext?.user?._id === props.user.id) && (
                            <button onClick={() => deletePostHandler(props._id)} className="flex bg-red-500 text-white items-center justify-between p-2.5 text-sm pl-4 cursor-pointer font-semibold hover:bg-red-400 duration-300 transition-all">
                                Delete
                                <div className='w-5 h-5'>
                                    {deleteIcon}
                                </div>
                            </button>
                        )}
                        {authContext?.user?._id === props.user.id && (
                            <button onClick={() => setUpdatePost(true)} className="flex text-black dark:text-white items-center justify-between p-2.5 text-sm pl-4 cursor-pointer bg-white dark:bg-black hover:bg-[#00376b1a] dark:hover:bg-gray-600 duration-300 transition-all">
                                Edit
                                <div className='w-5 h-5 text-black dark:text-white'>
                                    {editPostIcon}
                                </div>
                            </button>
                        )}
                    </div>

                </ShowDialogModal>
            )}

            {updatePost && (
                <UpdatePost postInfo={props} updatePost={updatePost} setUpdatePost={setUpdatePost} />
            )}

            {/* post image container */}

            <Slider {...settings} className='w-full h-full'>
                {props.media.map((data) => (
                    <div key={data._id} className='relative w-full h-full'>
                        <div onDoubleClick={() => setLike(props._id)} className='flex justify-center items-center w-full h-full'>
                            <img
                                draggable="false"
                                loading="lazy"
                                className="w-full h-auto object-cover object-center"
                                src={`http://localhost:4002/images/posts/${data.filename}`}
                                alt="post image"
                            />
                        </div>
                        {likeEffect && (
                            <img
                                draggable="false"
                                height="80px"
                                className="likeEffect absolute inset-0 m-auto"
                                alt="heart"
                                src="https://img.icons8.com/ios-filled/2x/ff0000/like.png"
                            />
                        )}
                    </div>
                ))}
            </Slider>




            {/* container for the entire component */}
            <div className="flex flex-col justify-between h-full mt-1">
                {/* comment input container */}
                <div className="mt-auto">
                    {/* like comment container */}
                    <div className="flex flex-col px-4 space-y-1 dark:border-gray-300/20 border-gray-300  border-b pb-2 mt-2">

                        {/* icons container */}
                        <div className="flex items-center justify-between py-2">
                            <div className="flex space-x-4">
                                <button className='w-6 h-6 text-black dark:text-white' onClick={() => handleLike(props._id)}>{liked ? likeFill : likeIconOutline}</button>
                                <button className='w-6 h-6 text-black dark:text-white' onClick={() => commentInput.current?.focus()}>{commentIcon}</button>
                                <button className='w-6 h-6 text-black dark:text-white'>
                                    {shareIcon}
                                </button>
                            </div>
                            <button className='w-6 h-6 text-black dark:text-white' onClick={() => handleSave(props._id)}>{(props.isSaved || saved) ? saveIconFill : saveIconOutline}</button>
                        </div>

                        {/* likes  */}
                        <button onClick={() => setIsOpenShowLiked(true)} className="font-semibold text-sm cursor-pointer text-left text-black dark:text-white">{listUserLiked.length} likes</button>

                        {/* comment */}
                        <div className="flex flex-auto items-center space-x-1 text-black dark:text-white">
                            <Link to={`/profile/${props.user.id}`} className="text-sm font-semibold hover:underline">{props.user.username}</Link>
                            <span className="text-sm truncate line-clamp-1">{props.title}</span>
                        </div>

                        <div className={` ${showMoreDesc ? "flex" : "hidden"} gap-[2px] flex-col text-black dark:text-white`}>
                            <span className="text-sm truncate">{props.description}</span>
                            <span className="text-sm truncate text-primary-blue">{props.hashtags}</span>
                        </div>

                        <button onClick={() => setShowMoreDesc(prev => !prev)} className='text-left text-[14px] text-gray-500 cursor-pointer'>{showMoreDesc ? "...close" : "...more"}</button>

                        {/* time */}
                        {props.comments.length > 0 ? (
                            <span onClick={() => setViewComment(!viewComment)} className="text-[13px] text-gray-500 cursor-pointer">
                                {viewComment ? "Hide Comments" : `View All ${props.comments.length} Comments`
                                }
                            </span>
                        ) : (
                            <span className="text-[13px] text-gray-500">No Comments Yet!</span>
                        )}

                        <span className="text-xs text-gray-500">{<DateConverter date={props.createdAt} />}</span>

                        {viewComment &&
                            <div className="w-full h-52 overflow-y-auto py-1">
                                {props.comments.map((c) => (
                                    <div className="flex items-start mb-2 border-b dark:border-gray-300/20 border-gray-300  space-x-3" key={c._id}>
                                        <Link to={`/profile/${c.userid}`} className='mt-2'>
                                            <img draggable="false" className="h-7 w-7 rounded-full shrink-0 object-cover mr-0.5" src={`http://localhost:4002/images/profiles/${c.userPicture.filename}`} alt="avatar" />
                                        </Link>
                                        <div className='flex justify-between w-full p-1'>
                                            <div className='flex flex-col items-start mb-2 space-y-1 text-black dark:text-white'>
                                                <Link to={`/profile/${c.userid}`} className="text-sm font-semibold hover:underline">{c.username}</Link>
                                                <p className="text-sm line-clamp-3">{c.content}</p>
                                                <span className="text-xs text-gray-500">{<DateConverter date={c.createdAt} />}</span>
                                            </div>
                                            {(props.user.id === authContext?.user?._id || c.userid === authContext?.user?._id) && (
                                                <button onClick={() => {
                                                    let objDeleteComment = {
                                                        commentid: c._id
                                                    }
                                                    deleteComment(objDeleteComment)
                                                }}>
                                                    <div className='w-4 h-4 text-black dark:text-white'>
                                                        {deleteIcon}
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }

                    </div>

                    {/* other content here (e.g., list of comments) */}


                    <form onSubmit={e => e.preventDefault()} className="flex items-center justify-between p-3 w-full space-x-3">
                        <span onClick={() => setShowEmojis(!showEmojis)} className="cursor-pointer w-6 h-6 text-black dark:text-white">
                            {emojiIcon}
                        </span>

                        {showEmojis && (
                            <div className="absolute bottom-12 -left-2">
                                <EmojiPicker
                                    set="google"
                                    title="Emojis"
                                    onEmojiSelect={handleEmojiSelect}
                                />
                            </div>
                        )}

                        <input
                            className="flex-auto text-sm text-black dark:text-white outline-none border-none bg-transparent"
                            type="text"
                            value={comment}
                            ref={commentInput}
                            required
                            onFocus={() => setShowEmojis(false)}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                        />
                        <button
                            onClick={() => submitComment(props._id)}
                            type="submit"
                            className={`${comment.trim().length < 1 ? 'text-blue-300' : 'text-primary-blue'} text-sm font-semibold`}
                            disabled={comment.trim().length < 1}
                        >
                            Post
                        </button>
                    </form>
                </div>
            </div>


            {/* <ShowWhoLiked userLiked={props.likes} isOpenShowLiked={isOpenShowLiked} setIsOpenShowLiked={setIsOpenShowLiked} /> */}

            <ShowDialogModal
                isOpenShowLDialogModal={isOpenShowLiked}
                setisOpenShowLDialogModal={setIsOpenShowLiked}
                title="List User Liked"
                height='h-72'
            >
                {listUserLiked.length > 0 ? (
                    <div className='py-3 px-4 flex flex-col'>
                        {listUserLiked.map((data, index) => (
                            <div key={index} className='flex items-center justify-between border-b dark:border-gray-300/20 border-gray-300 p-2'>
                                <div className='flex items-center gap-2'>
                                    <Link className='shrink-0' to={`/profile/${data.userid}`}>
                                        <img draggable="false" className="h-12 w-12 rounded-full shrink-0 object-cover mr-0.5" src={`http://localhost:4002/images/profiles/${data.userPicture.filename}`} alt="avatar" />
                                    </Link>
                                    <div className='flex flex-col'>
                                        <Link to={`/profile/${data.userid}`} className="text-sm text-black dark:text-white font-semibold hover:underline">{data.username}</Link>
                                        <p className='text-xs text-gray-500'><DateConverter date={data.createdAt} /></p>
                                    </div>
                                </div>
                                <div className='ml-5'>
                                    {authContext?.user?._id !== data.userid && (
                                        <button
                                            onClick={() => {
                                                followToggle(data.userid);
                                            }}
                                            className="font-medium transition-all duration-300 hover:bg-primaryhover-blue bg-primary-blue text-sm text-white hover:shadow rounded px-2 md:px-6 py-1.5"
                                        >
                                            {followedListUser.includes(data.userid) ? "UnFollow" : "Follow"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='py-3 px-4 text-xl'>
                        No one has liked this post 😩
                    </div>
                )}
            </ShowDialogModal>
        </div >
    )
}

export default PostItem