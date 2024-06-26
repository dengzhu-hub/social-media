import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { edit } from "@/public/assets/icons";
import { useGetCurrentUser } from "@/react-query/queriesAndMutation";
import { Models } from "appwrite";




const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();
  console.log(currentUser)

  const savePosts = currentUser?.save
    .map((savePost: Models.Document) => ({
      ...savePost.post,
      creator: {
        imageUrl: currentUser?.imageUrl,
      },
    }))
    .reverse();

  return (
    <div className="saved-container">
      <div className="flex w-full max-w-5xl gap-2">
        <img
          src={edit}
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="w-full text-left h3-bold md:h2-bold">Saved Posts</h2>
      </div>

      {!currentUser ? (
        <Loader children='' />
      ) : (
        <ul className="flex justify-center w-full max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-light-4">还没有保存任何帖子!</p>
          ) : (
            <GridPostList posts={savePosts} showStars={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
