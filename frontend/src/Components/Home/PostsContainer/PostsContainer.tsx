import React, { useState } from 'react'
import StoriesContainer from '../StoriesContainer/StoriesContainer'
import SkeletonPost from '../../SkeletonPost/SkeletonPost'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostItem from '../PostItem/PostItem';
import SpinLoader from '../../SpinLoader/SpinLoader';

function PostsContainer() {

    const handleClose = () => setUsersDialog(false);
    const [usersList, setUsersList] = useState([]);
    const [usersDialog, setUsersDialog] = useState(true);
    const [page, setPage] = useState(2);

    return (
        <>
            <div className="flex flex-col w-full lg:w-2/3 sm:mt-6 sm:px-8 mb-8">

                <StoriesContainer />

                {
                    Array(5).fill("").map((el, i) => (<SkeletonPost key={i} />))
                }

                {/* <div className="w-full h-full mt-1 sm:mt-6 flex flex-col space-y-4"> */}
                    <PostItem />
                {/* </div> */}

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