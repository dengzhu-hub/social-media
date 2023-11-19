import PostForm from '@/components/form/PostForm'
import { post } from '@/public/assets/icons'
import React from 'react'

const CreatePost = () => {
  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className='flex gap-2 w-full max-w-5xl flex-start justify-start'>
          <img src={post} alt="" width={36} height={36} />
          <h3 className='h3-bold md:h2-bold text-left w-full'>create post</h3>
        </div>
        <PostForm></PostForm>
      </div>
    </div>
  )
}

export default CreatePost