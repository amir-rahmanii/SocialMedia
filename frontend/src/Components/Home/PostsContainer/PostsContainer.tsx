import React, { useState } from 'react'
import StoriesContainer from '../StoriesContainer/StoriesContainer'
import SkeletonPost from '../../SkeletonPost/SkeletonPost'
import PostItem from '../PostItem/PostItem';
import NewPost from '../NewPost/NewPost';
import { postUploadOutline } from '../../SvgIcon/SvgIcon';
import useGetData from '../../../hooks/useGetData';
import { Post } from '../../../hooks/post/post.types';



function PostsContainer() {

    const { data, isLoading } = useGetData<Post[]>(
        ['AllPostAllUsers'],
        'posts/get-all-posts'
    );

  
    

    const [newPost, setNewPost] = useState(false);

    return (
        <>
            <div className='flex flex-col md:ml-20 lg:ml-32 items-center md:w-5/6 lg:w-3/6 xl:w-4/6 justify-center w-full sm:mt-6 sm:px-8 mb-8'>
                <StoriesContainer />

                <div className="flex flex-col w-full xl:w-5/6 sm:mt-6 sm:px-8 mb-8">


                    {isLoading ? (
                        Array(5).fill("").map((el, i) => (<SkeletonPost key={i} />))
                    ) : (
                        <>
                            {data && data?.length > 0 ? (
                                <div className="flex flex-col space-y-4">
                                    {data?.map((post) => (
                                        <PostItem key={post._id} {...post} />
                                    ))}
                                </div>
                            ) : (
                                <div className='text-black dark:text-white text-center mt-2 p-4 text-xl rounded'>
                                    Sorry, no posts have been registered yet😩
                                    <div className='flex items-center justify-center gap-3 mt-2'>
                                        <span> You be the first</span>
                                        <div onClick={() => setNewPost(true)} className="cursor-pointer w-6 h-6">{postUploadOutline}</div>
                                    </div>
                                    <NewPost newPost={newPost} setNewPost={setNewPost} />
                                </div>
                            )}
                        </>

                    )
                    }


                </div>
            </div>
        </>
    )
}

export default PostsContainer