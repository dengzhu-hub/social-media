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
      <div className='w-full h-full flex-center'>
        <Loader children=''></Loader>
      </div>
    )
  }
  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className='flex justify-start w-full max-w-5xl gap-2 flex-start'>
          <img src={post} alt="" width={36} height={36} />
          <h3 className='w-full text-left capitalize h3-bold md:h2-bold'>edit post</h3>
        </div>
        {isLoadingPost ? <Loader children=''></Loader> : <PostForm action='Update' post={posts}></PostForm>}
      </div>
    </div>
  )
}

export default UpdatePost