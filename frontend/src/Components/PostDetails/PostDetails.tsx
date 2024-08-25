import { ClickAwayListener } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { banIcon, deleteIcon, editPostIcon } from '../SvgIcon/SvgIcon';
import { useDeletePost } from '../../hooks/post/usePost';
import toast from 'react-hot-toast';
import { AuthContext } from '../../Context/AuthContext';
import { usePostUserBan } from '../../hooks/user/useUser';
import UpdatePost from '../Home/UpdatePost/UpdatePost';
import { PostItemProps } from '../Home/PostsContainer/PostsContainer';

type PostDetailsProps = {
    postInfo: PostItemProps,
    setPostDetailsToggle: (value: boolean) => void,
    postId: string,
    userID: string,
    isBan: boolean,
}

function PostDetails({ postInfo, setPostDetailsToggle, postId, userID, isBan }: PostDetailsProps) {


    const { mutate: deletePost, isSuccess: isSuccessDeletePost, isError: isErrorDeletePost, error: errorDeletePost } = useDeletePost();
    const { mutate: banUser, data, isSuccess: isSuccessBanUser, isError: isErrorBanUSer, error: errorBanUser } = usePostUserBan();

    const authContext = useContext(AuthContext);
    const [updatePost, setUpdatePost] = useState(false)

    const deletePostHandler = (postId: string) => {
        let newObj = {
            postid: postId
        }
        deletePost(newObj)
    }

    const banUserHandler = (userid: string) => {
        let newObjBanUser = {
            userid
        }
        banUser(newObjBanUser)
    }

    useEffect(() => {
        if (isErrorDeletePost) {
            if (errorDeletePost && (errorDeletePost as any).response) {
                toast.error((errorDeletePost as any).response.data.error.message,
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

        if (isSuccessDeletePost) {
            toast.success("Post removed successfuly",
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
    }, [isErrorDeletePost, isSuccessDeletePost])

    useEffect(() => {
        if (isErrorBanUSer) {
            if (errorBanUser && (errorBanUser as any).response) {
                toast.error((errorBanUser as any).response.data.error.message,
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

        if (isSuccessBanUser) {
            toast.success(data.data.response.message,
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
    }, [isErrorBanUSer, isSuccessBanUser])


    return (
        <>
                <div>
                    <div className="absolute w-36 bg-white rounded  drop-shadow right-0 top-12 z-30  border">
                        <div className="flex flex-col w-full overflow-hidden rounded">
                            {(authContext?.user?._id === userID || authContext?.user?.role === "ADMIN") ? (
                                <button onClick={() => deletePostHandler(postId)} className="flex bg-red-500 text-white items-center justify-between p-2.5 text-sm pl-4 cursor-pointer font-semibold hover:bg-red-400 duration-300 transition-all">
                                    Delete
                                    <div className='w-4 h-4'>
                                        {deleteIcon}
                                    </div>
                                </button>
                            ) :
                                <p className='flex items-center justify-between p-2.5 text-sm pl-4 cursor-pointer hover:bg-gray-50 duration-300 transition-all'>Sorry, you do not have access to this section😩</p>
                            }
                            {authContext?.user?._id === userID && (
                                <button onClick={() => setUpdatePost(true)} className="flex items-center justify-between p-2.5 text-sm pl-4 cursor-pointer hover:bg-gray-50 duration-300 transition-all">
                                    Edit
                                    <div className='w-4 h-4'>
                                        {editPostIcon}
                                    </div>
                                </button>
                            )}
                            {authContext?.user?.role === "ADMIN" && (
                                <button onClick={() => banUserHandler(userID)} className="flex items-center justify-between p-2.5 text-sm pl-4 cursor-pointer hover:bg-gray-50 duration-300 transition-all">
                                    {isBan ? "Un Ban User" : "Ban User"}
                                    <div className='w-5 h-5'>
                                        {banIcon}
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {updatePost && (
                    <UpdatePost postInfo={postInfo} updatePost={updatePost} setUpdatePost={setUpdatePost} />
                )}
        </>
    )
}

export default PostDetails