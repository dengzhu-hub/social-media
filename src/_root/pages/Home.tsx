import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import {
  useGetPosts,
  useGetRecentPosts,
  useGetUsers,
} from "@/react-query/queriesAndMutation";
import { Models } from "appwrite";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetPosts();
    console.log(data)
   
  const { ref, inView } = useInView();

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



  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  if (isErrorPost && isErrorUser) return <div>错误发生！</div>;
  
  if (!data || !posts) return (
    <Loader children="" />
  )
  const {pages} = data;
  console.log(pages[0])

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
              {pages[0]?.documents.map((post: Models.Document) => (
                <PostCard post={post} key={post.$id} />
              ))}
            </ul>
          )}
        </div>
        {hasNextPage && (
          <div className="mt-10" ref={ref}>
            <Loader children="" />
          </div>
        )}
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
