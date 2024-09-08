import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { commentIcon, deleteIcon, emojiIcon, likeIconOutline, moreIcons, saveIconFill, saveIconOutline, shareIcon } from '../../SvgIcon/SvgIcon'
import { likeFill } from '../../SvgIcon/SvgIcon';
import EmojiPicker from '@emoji-mart/react';
import { PostItemProps } from '../PostsContainer/PostsContainer';
import DateConverter from '../../../utils/DateConverter';
import { useDeleteComment, usePostAddComment, usePostLikeToggle, usePostSavePostToggle } from '../../../hooks/post/usePost';
import toast from 'react-hot-toast';
import ShowWhoLiked from '../../ShowWhoLiked/ShowWhoLiked';
import PostDetails from '../../PostDetails/PostDetails';
import Slider from "react-slick";
import { AuthContext } from '../../../Context/AuthContext';



function PostItem(props: PostItemProps) {
    const commentInput = useRef<HTMLInputElement>(null);
    const authContext = useContext(AuthContext)
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [comment, setComment] = useState("");
    const [viewComment, setViewComment] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [likeEffect, setLikeEffect] = useState(false);
    const [showMoreDesc, setShowMoreDesc] = useState(false);
    const [isOpenShowLiked, setIsOpenShowLiked] = useState(false);
    const [postDatailsToggle, setPostDetailsToggle] = useState(false);


    const { mutate: addPostLikeToggle } = usePostLikeToggle();
    const { mutate: addPostSaveToggle } = usePostSavePostToggle();
    const { mutate: addComment, isSuccess: isSuccessAddComment, isError: isErrorAddComment, error } = usePostAddComment();
    const { mutate: deleteComment, isSuccess: isSuccessDeleteComment, isError: isErroeDeleteComment, error: errorDeleteComment } = useDeleteComment();

    const setLike = (postid: string) => {
        setLikeEffect(true)
        setTimeout(() => {
            setLikeEffect(false)
        }, 500)
        if (props.likes.some(id => props.user.id === id.userid)) {
            return;
        }
        handleLike(postid);
    }

    const handleLike = (postid: string) => {
        let newObjLikeToggle = {
            postid
        }
        addPostLikeToggle(newObjLikeToggle)
        setLiked(prev => !prev)
    }

    const handleSave = (postid: string) => {
        let newObjSaveToggle = {
            postid
        }
        addPostSaveToggle(newObjSaveToggle)
        setSaved(prev => !prev)
    }

    //for show liked
    useEffect(() => {
        let isLiked = props.likes.some(id => authContext?.user?._id === id.userid);
        let isPosted = props.saved.some(id => authContext?.user?._id === id);
        setLiked(isLiked);
        setSaved(isPosted);
    }, [])

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
        let newObjAddComment = {
            postid,
            title: "title",
            content: comment
        }

        addComment(newObjAddComment),
            setComment('')
    }

    useEffect(() => {
        if (isErrorAddComment) {
            if (error && (error as any).response) {
                toast.error((error as any).response.data.error.message,
                    {
                        icon: '❌',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                )
            }
        }

        if (isSuccessAddComment) {
            toast.success("Comment Add successfuly",
                {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            )
        }
    }, [isErrorAddComment, isSuccessAddComment])


    useEffect(() => {
        if (isErroeDeleteComment) {
            if (errorDeleteComment && (errorDeleteComment as any).response) {
                toast.error((errorDeleteComment as any).response.data.error.message,
                    {
                        icon: '❌',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                )
            }
        }

        if (isSuccessDeleteComment) {
            toast.success("Comment removed successfuly",
                {
                    icon: '✅',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            )
        }
    }, [isErroeDeleteComment, isSuccessDeleteComment])



    return (
        <div className="flex flex-col rounded bg-white dark:bg-black relative mt-3">

            <div className="flex justify-between px-3 py-2.5 border-b dark:border-gray-300/20 border-gray-300  items-center">
                <div className="flex space-x-3 items-center">
                    <Link to={`/profile/${props.user.id}`}><img draggable="false" className="w-10 h-10 rounded-full object-cover" src={`http://localhost:4002/images/profiles/${props.user.userPicture.filename}`} alt="avatar" /></Link>
                    <Link to={`/profile/${props.user.id}`} className="text-black dark:text-white text-sm font-semibold">{props.user.username}</Link>
                </div>
                <button onClick={() => setPostDetailsToggle(true)} className="cursor-pointer text-black dark:text-white">{moreIcons}</button>
            </div>

            {postDatailsToggle && (
                <PostDetails isShowPostDetails={postDatailsToggle} setIsShowPostDetails={setPostDetailsToggle} postInfo={props} isBan={props.user.isban} postId={props._id} userID={props.user.id} />
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
                        <button onClick={() => setIsOpenShowLiked(true)} className="font-semibold text-sm cursor-pointer text-left text-black dark:text-white">{props.likes.length} likes</button>

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
                                            {(authContext?.user?.role === "ADMIN" || props.user.id === authContext?.user?._id || c.userid === authContext?.user?._id) && (
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


            <ShowWhoLiked userLiked={props.likes} isOpenShowLiked={isOpenShowLiked} setIsOpenShowLiked={setIsOpenShowLiked} />

        </div >
    )
}

export default PostItem