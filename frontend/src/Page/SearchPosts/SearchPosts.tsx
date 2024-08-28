import React, { useContext, useEffect } from 'react'
import SpinLoader from '../../Components/SpinLoader/SpinLoader'
import MetaData from '../../Components/MetaData/MetaData'
import Header from '../../Parts/Header/Header'
import { useParams } from 'react-router-dom'
import { useGetAllSearchPosts } from '../../hooks/post/usePost'
import PostContainerUser from '../../Components/User/PostContainerUser/PostContainerUser'
import { AuthContext } from '../../Context/AuthContext'
import { useGetUserInformation } from '../../hooks/user/useUser'

function SearchPosts() {
  const { title } = useParams()

  const { data: mySearchPosts, isLoading: isLoadingSearchPost, refetch } = useGetAllSearchPosts(title as string);

  const authContext = useContext(AuthContext);
  const { data: informationUser , isSuccess } = useGetUserInformation();


  useEffect(() => {
      if(isSuccess && informationUser){
          authContext?.setUser(informationUser.response.user)  
      }
  }, [isSuccess , informationUser])


  useEffect(() => {
    refetch();
  }, [title])



  return (

    <>
      <MetaData title="Instagram" />
      <Header />
      <div className="flex gap-2 h-full w-full md:w-4/6 mt-14 mx-auto p-3 md:p-0">
        {isLoadingSearchPost ? <SpinLoader /> : (
          (mySearchPosts && mySearchPosts.response && mySearchPosts.response.resultSearch.length > 0) ? (
            <PostContainerUser showCol = {false} posts={mySearchPosts.response.resultSearch} />
          ) : (
            <div className='bg-white w-full text-center mt-2 p-4 text-xl rounded'>
              Sorry, No posts were found with your search😩
              <div className='flex items-center justify-center gap-3 mt-2'>
                <span> You be the first search valid title</span>
              </div>
            </div>
          )
        )}
      </div>
    </>

  )
}

export default SearchPosts