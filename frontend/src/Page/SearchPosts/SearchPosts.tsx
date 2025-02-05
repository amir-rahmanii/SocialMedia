import {  useEffect } from 'react'
import SpinLoader from '../../Components/SpinLoader/SpinLoader'
import MetaData from '../../Components/MetaData/MetaData'
import { useParams } from 'react-router-dom'
import PostContainerUser from '../../Components/User/PostContainerUser/PostContainerUser'
import useGetData from '../../hooks/useGetData'
import { Post } from '../../hooks/post/post.types'
import SideBarLeft from '../../Parts/User/SideBarLeft/SideBarLeft'
import Header from '../../Parts/User/Header/Header'
import SideBarBottom from '../../Parts/User/SideBarBottom/SideBarBottom'

function SearchPosts() {
  const { title } = useParams()

  const { data: mySearchPosts, isLoading: isLoadingSearchPost, refetch } = useGetData<Post[]>(
    ['searchPosts'],
    `posts/search-posts?query=${title}`
  );







  useEffect(() => {
    refetch();
  }, [title])



  return (

    <>
      <MetaData title="Instagram" />
      <Header />
      <SideBarLeft />
      <div className="flex gap-2 h-full w-full md:w-5/6 mt-14 md:mt-0 mx-auto p-3 md:p-0">
        {isLoadingSearchPost ? <SpinLoader /> : (
          (mySearchPosts && mySearchPosts.length > 0) ? (
            <PostContainerUser showCol = {false} posts={mySearchPosts} />
          ) : (
            <div className='text-black dark:text-white w-full text-center mt-2 p-4 text-xl rounded-sm'>
              Sorry, No posts were found with your search😩
              <div className='flex items-center justify-center gap-3 mt-2'>
                <span> You be the first search valid title</span>
              </div>
            </div>
          )
        )}
        <SideBarBottom/>
      </div>
    </>

  )
}

export default SearchPosts