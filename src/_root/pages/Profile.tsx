import GridPostList from "@/components/shared/GridPostList";
import LikedPosts from "@/components/shared/LikedPosts";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/userContext";
import { edit, profile, post, liked } from "@/public/assets/icons";
import { useGetUserById } from "@/react-query/queriesAndMutation";
import { useLocation, useParams, Link, Route, Outlet, Routes } from "react-router-dom";
interface StatBlockProps {
  value: string | number,
  label: string,
}
const StatBlock = ({value, label}:StatBlockProps) => {
 return (
  <div className="gap-2 flex-center">
  <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
  <p className="small-medium lg:base-medium text-light-2">{label}</p>
</div>
 )
  
}
const Profile = () => {
  const { pathname } = useLocation();
  const { user } = useAuthUser();
  const { id } = useParams();
  const { data: currentUser } = useGetUserById(id || "");
  if (!currentUser) {
    return <Loader children="" />;
  }
  console.log(currentUser)
  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex flex-col flex-1 xl:flex-row max-xl:items-center gap-7">
          <img src={currentUser?.imageUrl || profile} className="rounded-full w-28 h-28 lg:h-36 lg:w-36" alt="profile" />
          <div className="flex flex-col justify-between flex-1 md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center h3-bold xl:text-left md:h1-semibold">{currentUser.name}</h1>
              <p className="text-center text-light-3 small-regular md:body-medium xl:text-left">@{currentUser.username}</p>
            </div>
            <div className="z-20 flex flex-wrap items-center justify-center gap-8 mt-10 xl:justify-start">
              <StatBlock value={currentUser?.post.length} label="Posts" />
              <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" />
              
            </div>
              <p>{currentUser.bio}</p>
          </div>
          <div className="flex justify-center gap-4 ">
          <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser.$id && "hidden"
                }`}>
                <img
                  src={edit}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === id && "hidden"}`}>
              <Button type="button" className="px-8 shad-button_primary">
                Follow
              </Button>
            </div>
            
          </div>
          
             
            
        </div>

      </div>
      {currentUser.$id === user.id && (
        <div className="flex w-full max-w-5xl">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}>
            <img
              src={post}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}>
            <img
              src={liked}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

<Routes>
        <Route
          index
          element={<GridPostList posts={currentUser?.post} showUser={false} />}
        />
        {currentUser.$id === user.id && (
          <Route path='/liked-posts' element={<LikedPosts />} />
        )}
      </Routes>
    <Outlet />

    </div>
  );
};

export default Profile;
