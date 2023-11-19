import PostForm from '@/components/form/PostForm'
import Loader from '@/components/shared/Loader';
import { post } from '@/public/assets/icons'
import { useGetPostBYId } from '@/react-query/queriesAndMutation';
import { useParams } from 'react-router-dom';


const UpdatePost = () => {
  const { id } = useParams();
  const { data: posts, isPending: isLoadingPost } = useGetPostBYId(id || '');
  if (isLoadingPost) {
    return (
      <div className='flex-center w-full h-full'>
        <Loader children=''></Loader>
      </div>
    )
  }
  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className='flex gap-2 w-full max-w-5xl flex-start justify-start'>
          <img src={post} alt="" width={36} height={36} />
          <h3 className='h3-bold md:h2-bold text-left w-full capitalize'>edit post</h3>
        </div>
        {isLoadingPost ? <Loader children=''></Loader> : <PostForm action='UPDATE' post={posts}></PostForm>}
      </div>
    </div>
  )
}

export default UpdatePost