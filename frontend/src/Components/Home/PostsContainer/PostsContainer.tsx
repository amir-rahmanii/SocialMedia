import React, { useState } from 'react'
import StoriesContainer from '../StoriesContainer/StoriesContainer'
import SkeletonPost from '../../SkeletonPost/SkeletonPost'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostItem from '../PostItem/PostItem';
import SpinLoader from '../../SpinLoader/SpinLoader';
import { useGetAllPostAllUsers } from '../../../hooks/post/usePost';
import PostItemProps from '../PostItem/PostItem'

export type PostItemProps = {
    _id: string,
    comments: any[],
    description: string,
    hashtags: string,
    likes: {
        createdAt: string,
        postid: string
        updatedAt: string
        userid: string
        _id: string
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
                            <div>
                                NO POST
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