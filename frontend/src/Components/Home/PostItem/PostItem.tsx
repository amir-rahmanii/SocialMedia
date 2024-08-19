import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { commentIcon, emojiIcon, likeIconOutline, moreIcons, saveIconFill, saveIconOutline, shareIcon } from '../../SvgIcon/SvgIcon'
import { likeFill } from '../../SvgIcon/SvgIcon';
import EmojiPicker from '@emoji-mart/react';
import { PostItemProps } from '../PostsContainer/PostsContainer';
import DateConverter from '../../../utils/DateConverter';
import { usePostLikeToggle } from '../../../hooks/post/usePost';




function PostItem(props: PostItemProps) {
    const commentInput = useRef<HTMLInputElement>(null);

    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [comment, setComment] = useState("");
    const [viewComment, setViewComment] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [likeEffect, setLikeEffect] = useState(false);

    const { mutate: addPostLikeToggle } = usePostLikeToggle()

    const setLike = (postid: string) => {
        setLikeEffect(true)
        setTimeout(() => {
            setLikeEffect(false)
        }, 500)
        if (liked) {
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
    
    return (
        <div className="flex flex-col border rounded bg-white relative mt-3">

            <div className="flex justify-between px-3 py-2.5 border-b items-center">
                <div className="flex space-x-3 items-center">
                    <Link to=""><img draggable="false" className="w-10 h-10 rounded-full object-cover" src={"/src/assets/images/hero.png"} alt="avatar" /></Link>
                    <Link to="" className="text-black text-sm font-semibold">{props.user.username}</Link>
                </div>
                <span className="cursor-pointer">{moreIcons}</span>
            </div>

            {/* post image container */}
            <div className="relative flex items-center justify-center" onDoubleClick={() => setLike(props._id)}>
                <img draggable="false" loading="lazy" className="w-full h-full object-cover object-center" src={`http://localhost:4002/images/posts/${props.media.filename}`} alt="post image" />
                {likeEffect &&
                    <img draggable="false" height="80px" className="likeEffect" alt="heart" src="https://img.icons8.com/ios-filled/2x/ffffff/like.png" />
                }
            </div>

            {/* like comment container */}
            <div className="flex flex-col px-4 space-y-1 border-b pb-2 mt-2">

                {/* icons container */}
                <div className="flex items-center justify-between py-2">
                    <div className="flex space-x-4">
                        <button onClick={() => handleLike(props._id)}>{props.likes.some(id => props.user.id === id.userid) ? likeFill : likeIconOutline }</button>
                        <button onClick={() => commentInput.current?.focus()}>{commentIcon}</button>
                        {shareIcon}
                    </div>
                    <button>{saved ? saveIconFill : saveIconOutline}</button>
                </div>

                {/* likes  */}
                <span className="font-semibold text-sm cursor-pointer">{props.likes.length} likes</span>

                {/* comment */}
                <div className="flex flex-auto items-center space-x-1">
                    <p className="text-sm font-semibold hover:underline">{props.user.username}</p>
                    <span className="text-sm truncate">{props.title}</span>

                </div>

                <div className='flex flex-col gap-[2px]'>
                    <span className="text-sm truncate">{props.description}</span>
                    <span className="text-sm truncate text-primary-blue">{props.hashtags}</span>
                </div>

                {/* time */}

                <span onClick={() => setViewComment(!viewComment)} className="text-[13px] text-gray-500 cursor-pointer">
                    {viewComment ? "Hide Comments" :
                        1 === 1 ?
                            `View ${props.comments.length} Comment` :
                            `View All ${props.comments.length} Comments`
                    }
                </span> :

                {/* <span className="text-[13px] text-gray-500">No Comments Yet!</span> */}
                <span className="text-xs text-gray-500 cursor-pointer">{<DateConverter date={props.createdAt} />}</span>

                {/* {viewComment &&
            <ScrollToBottom className="w-full h-52 overflow-y-auto py-1">
                {allComments.map((c) => (
                    <div className="flex items-start mb-2 space-x-2" key={c._id}>
                        <img draggable="false" className="h-7 w-7 rounded-full object-cover mr-0.5" src={c.user.avatar} alt="avatar" />
                        <Link to={`/${c.user}`} className="text-sm font-semibold hover:underline">{c.user.username}</Link>
                        <p className="text-sm">{c.comment}</p>
                    </div>
                ))}
            </ScrollToBottom>
        } */}

            </div>

            {/* comment input container */}
            <form onSubmit={e => e.preventDefault()} className="flex items-center justify-between p-3 w-full space-x-3">
                <span onClick={() => setShowEmojis(!showEmojis)} className="cursor-pointer">{emojiIcon}</span>

                {showEmojis && (
                    <div className="absolute bottom-12 -left-2">
                        <EmojiPicker
                            set="google"
                            title="Emojis"
                        />
                    </div>
                )}

                <input
                    className="flex-auto text-sm outline-none border-none bg-transparent"
                    type="text"
                    value={comment}
                    ref={commentInput}
                    required
                    onFocus={() => setShowEmojis(false)}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..." />
                <button type="submit" className={`${comment.trim().length < 1 ? 'text-blue-300' : 'text-primary-blue'} text-sm font-semibold`} disabled={comment.trim().length < 1}>Post</button>
            </form>

        </div >
    )
}

export default PostItem