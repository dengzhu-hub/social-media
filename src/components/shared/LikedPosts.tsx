import { useGetCurrentUser } from '@/react-query/queriesAndMutation'
import React from 'react'
import Loader from './Loader';
import GridPostList from './GridPostList';

const LikedPosts = () => {
    const {data:currentUser} = useGetCurrentUser();
    if (!currentUser) return (
        <div className='w-full h-full flex-center'>
            <Loader children=''></Loader>
        </div>
    )
  return (
    <>
    {currentUser?.post.length === 0 && (
        <p>暂无喜欢的帖子</p>
    )}
    <GridPostList posts={currentUser?.post} showStars={false} />
    </>
    
  )
}

export default LikedPosts