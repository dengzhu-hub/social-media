import { logo } from "@/public/assets/images";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { logout, profile } from "@/public/assets/icons";
import { useSignOutAccount } from "@/react-query/queriesAndMutation";
import { useEffect } from "react";
import { useAuthUser } from "@/hooks/userContext";

const TopBar = () => {
  const navigate = useNavigate();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user } = useAuthUser();
  useEffect(() => {
    if (isSuccess) {
      navigate("/sign-in");
    }
  }, [isSuccess, navigate]);
  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-0 items-center">
          <img src={logo} aria-label="snapGram logo page" alt="snapgram logo" />
        </Link>
        <div className="flex gap-4">
          <Button
            onClick={() => signOut()}
            variant={"ghost"}
            className="shad-button_ghost"
          >
            <img src={logout} alt="logout " />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex gap-0 items-center">
            <img
              src={user.imageUrl || profile}
              className="w-8 h-8 rounded-full"
              aria-label="profile"
              alt="snapgram logo"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopBar;
