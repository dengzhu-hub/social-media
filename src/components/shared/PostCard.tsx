import { edit, profile } from '@/public/assets/icons';
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';
import { timeAgo } from '@/lib/utils';
import { useAuthUser } from '@/hooks/userContext';
import PostStats from './PostStats';
type PostProps = {
    post: Models.Document;
}
const PostCard = ({ post }: PostProps) => {
    console.log(post);
    console.log(post.creator);
    const { user } = useAuthUser();
    console.log(user);
    if (!post.creator) return;
    return (
        <div className='post-card'>
            <div className='flex-between'>
                <div className='flex items-center gap-3 '>
                    <Link to={`/profile/${post.creator.$id}`}>
                        <img src={post?.creator?.imageUrl || profile} alt="profile" className='w-12 lg:h-12 rounded-full' />
                    </Link>
                    <div className='flex flex-col gap-3'>
                        <p className='base-medium lg:body-bold text-light-1'> {post?.creator?.name}</p>
                        <div className='flex-center gap-2 text-light-3'>
                            <p className='subtle-semibold lg:small-regular'>{timeAgo(post.$createdAt)}</p>
                            -
                            <p className='subtle-semibold lg:small-regular'>{post?.location}</p>
                        </div>
                    </div>
                </div>
                <Link className={`${user.id !== post.creator.$id && 'hidden'}`} to={`/update-post/${post.$id}`}>
                    <img src={edit} className='w-6 h-6' alt="edit the post" />
                </Link>

            </div>
            <Link to={`/post/${post.$id}`}>
                <div className=''>
                    <p className='backdrop-sepia-0'>{post?.caption}</p>
                    <ul className='mt-2 flex   flex-1 gap-3'>
                        {post?.tags.map((tag: string) => (
                            <li className='small-medium text-light-3-2 ' key={tag}>#{tag}</li>
                        ))}
                    </ul>
                </div>
            </Link>
            <div>
                <img src={post?.imageUrl || profile} alt="image" className='rounded-md' />
            </div>
            <PostStats post={post} userId={user.id}></PostStats>
        </div>
    )
}

export default PostCard