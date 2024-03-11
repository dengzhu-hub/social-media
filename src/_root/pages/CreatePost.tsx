import PostForm from '@/components/form/PostForm'
import { post } from '@/public/assets/icons'
import React from 'react'

const CreatePost = () => {
  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className='flex justify-start w-full max-w-5xl gap-2 flex-start'>
          <img src={post} alt="" width={36} height={36} />
          <h3 className='w-full text-left h3-bold md:h2-bold'>create post</h3>
        </div>
        <PostForm action='Create'></PostForm>
      </div>
    </div>
  )
}

export default CreatePost