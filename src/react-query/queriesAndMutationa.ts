import { createUser, signInAccount } from "@/lib/appwrite/api";
import { INewUser } from "@/types";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

export function useCreateUserAccount() {
  return useMutation({
    mutationFn: (user: INewUser) => createUser(user),
  });
}

export function useSignAccount() {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
}
