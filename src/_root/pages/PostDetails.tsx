import { useGetPostBYId } from '@/react-query/queriesAndMutation';
import { useParams, Link } from 'react-router-dom';
import Loader from '@/components/shared/Loader';
import { profile } from '@/public/assets/icons';
const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending: isLoadingPost } = useGetPostBYId(id || '');
  return (
    <div className='post_details-container'>
      {isLoadingPost ? <Loader children=""></Loader> : (
        <div className='post_details-card'>
          <img src={post?.imageUrl} alt="" />


          <div className='post_details-info'>
            <Link to={`/profile/${post?.creator.$id}`}>
              <img src={post?.creator?.imageUrl || profile} alt="profile" className='w-12 lg:h-12 rounded-full' />
            </Link>
          </div>
        </div>
      )}
    </div>

  )
}

export default PostDetails