
import React, { useContext, useEffect, useState } from 'react'
import { banIcon, deleteIcon, editPostIcon } from '../SvgIcon/SvgIcon';
import { useDeletePost } from '../../hooks/post/usePost';
import toast from 'react-hot-toast';
import { AuthContext } from '../../Context/AuthContext';
import { usePostUserBan } from '../../hooks/user/useUser';
import UpdatePost from '../Home/UpdatePost/UpdatePost';
import { PostItemProps } from '../Home/PostsContainer/PostsContainer';
import { Dialog } from '@mui/material';

type PostDetailsProps = {
    postInfo: PostItemProps,
    postId: string,
    userID: string,
    isBan: boolean,
    isShowPostDetails: boolean,
    setIsShowPostDetails: (value: boolean) => void
}

function PostDetails({ postInfo, postId, userID, isBan, isShowPostDetails, setIsShowPostDetails }: PostDetailsProps) {


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
            <Dialog open={isShowPostDetails} onClose={() => setIsShowPostDetails(false)} maxWidth='xl'>
                <div className="flex flex-col min-w-60 border rounded dark:border-gray-300/20 border-gray-300">
                    <div className="flex flex-col w-full overflow-hidden rounded">
                        {(authContext?.user?._id === userID) && (
                            <button onClick={() => deletePostHandler(postId)} className="flex bg-red-500 text-white items-center justify-between p-2.5 text-sm pl-4 cursor-pointer font-semibold hover:bg-red-400 duration-300 transition-all">
                                Delete
                                <div className='w-5 h-5'>
                                    {deleteIcon}
                                </div>
                            </button>
                        )}
                        {authContext?.user?._id === userID && (
                            <button onClick={() => setUpdatePost(true)} className="flex text-black dark:text-white items-center justify-between p-2.5 text-sm pl-4 cursor-pointer bg-white dark:bg-black hover:bg-[#00376b1a] dark:hover:bg-gray-600 duration-300 transition-all">
                                Edit
                                <div className='w-5 h-5 text-black dark:text-white'>
                                    {editPostIcon}
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </Dialog>

            {updatePost && (
                <UpdatePost postInfo={postInfo} updatePost={updatePost} setUpdatePost={setUpdatePost} />
            )}
        </>
    )
}

export default PostDetails