// import {Auth}

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export const useAuthUser = () => {
  return useContext(AuthContext);
};
