import { useGetCurrentUser } from '@/react-query/queriesAndMutation'
import Loader from './Loader';
import GridPostList from './GridPostList';

const LikedPosts = () => {
    const {data:currentUser} = useGetCurrentUser();
    console.log(currentUser?.liked, currentUser)
    if (!currentUser) return (
        <div className='w-full h-full flex-center'>
            <Loader children=''></Loader>
        </div>
    )
  return (
    <>
    {currentUser?.liked.length === 0 && (
        <p>暂无喜欢的帖子</p>
    )}
    <GridPostList posts={currentUser?.liked} showStars={false} />
    </>
    
  )
}

export default LikedPosts