import { useDeletePost, useGetPostBYId } from '@/react-query/queriesAndMutation';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Loader from '@/components/shared/Loader';
import { back, del, edit, profile } from '@/public/assets/icons';
import { Button } from '@/components/ui/button';
import { useAuthUser } from '@/hooks/userContext';

import PostStats from '@/components/shared/PostStats';
import { timeAgo } from '@/lib/utils';
const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthUser();

  const { data: post, isLoading } = useGetPostBYId(id || '');

  const { mutate: deletePost } = useDeletePost();


  const handleDeletePost = () => {
     deletePost({ postId: id, imageId: post?.imageId });
    navigate(-1);
  };
  if (isLoading) return (
    <Loader children =''/>
  )
  return (
    <div className="post_details-container">
      <div className="hidden w-full max-w-5xl md:flex">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={back}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader children='' />
      ) : (
        <div className="post_details-card">
          <img
            src={post?.imageUrl}
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="w-full flex-between">
              <Link
                to={`/profile/${post?.creator?.$id}`}
                className="flex items-center gap-3">
                <img
                  src={
                    post?.creator?.imageUrl ||
                    profile
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full lg:w-12 lg:h-12"
                />
                <div className="flex flex-col gap-1">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator?.name}
                  </p>
                  <div className="gap-2 flex-center text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {timeAgo(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="gap-4 flex-center">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator?.$id && "hidden"}`}>
                  <img
                    src={edit}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ost_details-delete_btn ${user.id !== post?.creator?.$id && "hidden"
                    }`}>
                  <img
                    src={del}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="w-full border border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-2 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="w-full border border-dark-4/80" />

        <h3 className="w-full my-10 body-bold md:h3-bold">
          More Related Posts
        </h3>

      </div>
    </div>

  )
}

export default PostDetails