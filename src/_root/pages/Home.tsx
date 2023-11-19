import Loader from '@/components/shared/Loader'
import PostCard from '@/components/shared/PostCard';
import PostStats from '@/components/shared/PostStats';
import { useGetRecentPosts } from '@/react-query/queriesAndMutation';
import { Models } from 'appwrite';


const Home = () => {
  const { data: posts, isLoading: isLoadingPost, isError: isErrorPost } = useGetRecentPosts();
  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <h3 className='text-left h3-bold capitalize md:h2-bold w-full'>home feed</h3>
          {isLoadingPost && !posts ? <Loader children=""></Loader>
            : (
              <ul className='flex w-full flex-1 flex-col gap-9 '>
                {posts?.documents.map((post: Models.Document) => (

                  <PostCard post={post} key={post.$id} />

                ))}
              </ul>)}



        </div>
      </div>

    </div>

  )
}

export default Home