import {
  createPost,
  createUser,
  deletePost,
  deleteSavePost,
  getCurrentUser,
  getInfinitePosts,
  getPostById,
  getRecentPost,
  getUserById,
  getUsers,
  likePost,
  savePost,
  searchPosts,
  signInAccount,
  signOutAccount,
  updatePost,
  updateUser,
} from "@/lib/appwrite/api";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";

/**
 * 使用CreateUserAccount mutation
 * @returns {UseMutationResult<IBaseResponse>} 创建用户结果
 */
export function useCreateUserAccount() {
  return useMutation({
    mutationFn: (user: INewUser) => createUser(user),
  });
}

/**
 * 使用 useSignAccount 方法
 * @returns {Array} 返回一个包含mutationFn的数组
 */
export function useSignAccount() {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
}
/**
 * 使用 useSignOutAccount 方法
 * 返回一个包含 signOutAccount mutationFn 的 useMutation 对象
 * @returns {object} 包含 mutationFn 的 useMutation 对象
 */
export function useSignOutAccount() {
  return useMutation({
    mutationFn: signOutAccount,
  });
}

/**
 * 使用useMutation Hook创建一个用于创建帖子的函数
 */
export const useCreatePost = () => {
  // 使用useQueryClient Hook获取QueryClient实例
  const queryClient = useQueryClient();
  // 调用useMutation Hook并传入MutationConfig对象
  return useMutation({
    // 设置mutationFn属性为一个函数，用于执行创建帖子的逻辑
    mutationFn: (post: INewPost) => createPost(post),
    // 设置onSuccess属性为一个函数，用于在成功创建帖子后执行的操作
    onSuccess: () => {
      // 在成功创建帖子后，刷新获取最近帖子的查询结果
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

// 使用useQuery自定义hook来获取最近的帖子
export const useGetRecentPosts = () => {
  return useQuery({
    // 使用查询键来标识这个查询操作
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    // 调用getRecentPost函数作为查询函数
    queryFn: getRecentPost,
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: data => {
      // 在成功创建帖子后，刷新获取最近帖子的查询结果
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      savePost(userId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

/**
 * 使用删除保存帖子的mutation
 */
export const useDeleteSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    /**
     * 删除保存帖子的mutation函数
     * @param saveRecord - 要删除的保存帖子记录
     */
    mutationFn: (saveRecord: string) => deleteSavePost(saveRecord),
    /**
     * 删除成功后刷新获取当前用户的相关数据
     */
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

export const useGetPostBYId = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};
export function useGetPosts() {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts,
    getNextPageParam: lastPage => {
      if (lastPage && lastPage.documents.length === 0) return null;
      const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
}
export function useSearchPosts(searchTerm: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.search_post, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
}

export function useGetUsers(limit?:number) {
  return useQuery({
    queryKey:[QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),

  })
}


export function useGetUserById(userId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled:!!userId,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:(user:IUpdateUser) => updateUser(user),
    onSuccess:(data) => {
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER]
      });
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_USER_BY_ID,data?.$id]
      });
    }
    
  })
}