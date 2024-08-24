import React from 'react'
import PostItem from '../../Home/PostItem/PostItem'
import { PostItemProps } from '../../Home/PostsContainer/PostsContainer'



type PostContainerUserProps = {
    posts: PostItemProps[],
};

function PostContainerUser({ posts}: PostContainerUserProps) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1 sm:gap-8 my-1 mb-4 p-3">
                    {posts.map((post: PostItemProps) => (
                        <PostItem key={post._id} {...post} />
                    )).reverse()}
        </div>
    )
}

export default PostContainerUser