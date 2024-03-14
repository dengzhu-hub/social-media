import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import {
  useGetRecentPosts,
  useGetUsers,
} from "@/react-query/queriesAndMutation";
import { Models } from "appwrite";

const Home = () => {
  const {
    data: creators,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useGetUsers();
  const {
    data: posts,
    isLoading: isLoadingPost,
    isError: isErrorPost,
  } = useGetRecentPosts();

  if (isErrorPost && isErrorUser) return <div>错误发生！</div>;

  if (!posts) return <Loader children="" />;

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h3 className="w-full text-left capitalize h3-bold md:h2-bold">
            home feed
          </h3>
          {isLoadingPost && !posts ? (
            <Loader children=""></Loader>
          ) : (
            <ul className="flex flex-col flex-1 w-full gap-9 ">
              {posts?.documents.map((post: Models.Document) => (
                <PostCard post={post} key={post.$id} />
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className=" home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isLoadingUser && !creators ? (
          <Loader children="" />
        ) : (
          <ul className="grid gap-6 2xl:grid-cols-2">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
