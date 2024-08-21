import React, { useState } from 'react'
import StoriesContainer from '../StoriesContainer/StoriesContainer'
import SkeletonPost from '../../SkeletonPost/SkeletonPost'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostItem from '../PostItem/PostItem';
import SpinLoader from '../../SpinLoader/SpinLoader';
import { useGetAllPostAllUsers } from '../../../hooks/post/usePost';
import PostItemProps from '../PostItem/PostItem'
import NewPost from '../../Header/NewPost/NewPost';
import { postUploadOutline } from '../../SvgIcon/SvgIcon';

export type PostItemProps = {
    _id: string,
    saved: string[],
    comments: {
        title: string,
        content: string,
        createdAt: Date,
        postid: string,
        updatedAt: Date,
        userid: string,
        _id: string,
    }[],
    description: string,
    hashtags: string,
    likes: {
        createdAt: Date,
        postid: string,
        updatedAt: Date,
        userid: string,
        _id: string,
    }[],
    media: { path: string, filename: string },
    title: string,
    user: {
        email: string,
        id: string,
        isban: boolean,
        name: string,
        role: "ADMIN" | "USER",
        username: string
    },
    createdAt: Date,
    updatedAt: Date,
}



function PostsContainer() {

    const { data, isLoading } = useGetAllPostAllUsers();
    const [newPost, setNewPost] = useState(false);

    return (
        <>
            <div className="flex flex-col w-full lg:w-2/3 sm:mt-6 sm:px-8 mb-8">

                <StoriesContainer />

                {isLoading ? (
                    Array(5).fill("").map((el, i) => (<SkeletonPost key={i} />))
                ) : (
                    <>
                        {data?.response?.allPosts.length > 0 ? (
                            <div className="flex flex-col space-y-4">
                                {data.response.allPosts.map((post: PostItemProps) => (
                                    <PostItem key={post._id} {...post} />
                                ))}
                            </div>
                        ) : (
                            <div className='bg-white text-center mt-2 p-4 text-xl rounded'>
                                Sorry, no posts have been registered yet😩
                                <div className='flex items-center justify-center gap-3 mt-2'>
                                    <span> You be the first</span>
                                    <div onClick={() => setNewPost(true)} className="cursor-pointer">{postUploadOutline}</div>
                                </div>
                                <NewPost newPost={newPost} setNewPost={setNewPost} />
                            </div>
                        )}
                    </>

                )
                }


                {/* 
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchMorePosts}
                    hasMore={posts.length !== totalPosts}
                    loader={<SpinLoader />}
                >
                    <div className="w-full h-full mt-1 sm:mt-6 flex flex-col space-y-4">
                        {posts?.map((post) => (
                            <PostItem key={post._id} {...post} setUsersDialog={setUsersDialog} setUsersList={setUsersList} />
                        ))}
                    </div>
                </InfiniteScroll> */}

            </div>
        </>
    )
}

export default PostsContainer