import { useAuthUser } from '@/hooks/userContext'
import { Models } from 'appwrite'
import React from 'react'
import { Link } from 'react-router-dom'
import PostStats from './PostStats'


type GridPostListProps = {
  posts: Models.Document[],
  showUser?: boolean,
  showStars?: boolean,
}
const GridPostList = ({posts,showUser=true, showStars = true}:GridPostListProps) => {

  const {user} = useAuthUser();

  
  console.log(user)
  return (
    <ul className='grid-container'>{posts.map(post => (
      
      <li className='relative flex min-w-80 h-80' key={post?.$id}>
      <Link to={`/post/${post?.$id}`} className='grid-post_link'> 
      <img className='object-cover w-full h-full' src={post?.imageUrl} alt="image" />
      </Link>
      <div className='grid-post_user'>
        {showUser && (
          <div className='flex items-center justify-start gap-2 '>
            <img src={post?.creator?.imageUrl} className='w-8 h-8 rounded-full ' alt="post-user" />
            <p className='line-clamp-1'>{post?.creator?.name}</p>
          </div>
          
        )
    } {
      showStars && (
        <PostStats post={post} userId={user.id} />
      )
    }
      </div>
      </li>
      

    ))}</ul>
  )
}

export default GridPostList