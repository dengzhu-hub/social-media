import {
  bookMark,
  gallery,
  home,
  people,
  wallpaper,
} from "@/public/assets/icons";
export const sidebarLinks = [
  {
    imgURL: home,
    route: "/",
    label: "Home",
  },
  {
    imgURL: wallpaper,
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: people,
    route: "/all-users",
    label: "People",
  },
  {
    imgURL: bookMark,
    route: "/saved",
    label: "Saved",
  },
  {
    imgURL: gallery,
    route: "/create-post",
    label: "Create Post",
  },
];

export const bottomBarLinks = [
  {
    imgURL: home,
    route: "/",
    label: "Home",
  },
  {
    imgURL: wallpaper,
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: bookMark,
    route: "/saved",
    label: "Saved",
  },
  {
    imgURL: gallery,
    route: "/create-post",
    label: "Create",
  },
];
