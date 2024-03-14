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
/**
 * 使用`useGetPosts`函数来获取无限加载的文章数据。
 * 该函数内部使用了`useInfiniteQuery`钩子来实现分页加载文章数据的功能。
 * 
 * @returns 返回一个包含查询状态、数据、加载更多函数等属性的对象。
 */
export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts ,
    getNextPageParam: (lastPage) => {
      // 如果 lastPage 为 undefined 或者 lastPage.documents 为 undefined 或者为空数组，则没有更多页面
      if (!lastPage || !lastPage.documents || lastPage.documents.length === 0) {
        return null;
      }

      // 使用最后一个文档的 $id 作为游标
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
};


/**
 * 使用给定的搜索词进行帖子搜索。
 * 
 * @param searchTerm 搜索词，用于查询相关的帖子。
 * @returns 返回一个QueryResult对象，包含搜索帖子的结果数据、状态等信息。
 */
export function useSearchPosts(searchTerm: string) {
  // 使用queryFn定义的函数获取搜索结果，仅在searchTerm不为空时启用查询
  return useQuery({
    queryKey: [QUERY_KEYS.search_post, searchTerm], // 定义查询的键，包括固定的search_post和动态的searchTerm
    queryFn: () => searchPosts(searchTerm), // 指定查询函数，传入searchTerm获取搜索结果
    enabled: !!searchTerm, // 只有在searchTerm非空时才启用自动查询
  });
}

/**
 * 使用useQuery钩子来获取用户数据。
 * 
 * @param limit 可选参数，用于限制返回的用户数量。
 * @returns 返回一个包含查询状态、数据和其他实用方法的对象。
 */
export function useGetUsers(limit?:number) {
  // 使用Query Hook来执行异步数据获取，并管理状态
  return useQuery({
    queryKey:[QUERY_KEYS.GET_USERS], // 指定查询的键
    queryFn: () => getUsers(limit), // 指定执行查询的函数，可传入限制数量

  })
}


/**
 * 使用给定的用户ID来获取用户信息的自定义Hook。
 * 
 * @param userId 用户的唯一标识符，类型为字符串。
 * @returns 返回一个QueryResult对象，包含了用户信息的查询结果及其状态（如是否正在加载、是否有错误等）。
 */
export function useGetUserById(userId: string) {
  // 使用queryKey来唯一标识查询，定义查询功能的执行函数，并根据userId是否存在来决定是否启用查询
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId], // 使用数组包含QUERY_KEYS.GET_USER_BY_ID和userId作为查询的键
    queryFn: () => getUserById(userId), // 定义执行查询的函数，此处使用getUserById函数来获取用户信息
    enabled:!!userId, // 根据userId是否存在来决定是否启用自动查询，如果userId存在，则启用查询；否则，禁用查询
  });
}

/**
 * 使用`useUpdateUser`函数来创建一个用于更新用户的mutation。
 * 
 * @returns 返回一个包含`mutate`和`mutateAsync`方法的对象，用于更新用户信息，并在成功更新后自动刷新相关的查询数据。
 */
export function useUpdateUser() {
  // 获取Query Client实例
  const queryClient = useQueryClient();
  
  // 使用useMutation钩子来创建一个用于更新用户信息的mutation
  return useMutation({
    // 定义mutation的执行函数，接收一个用户信息对象作为参数，并调用`updateUser`函数进行更新
    mutationFn:(user:IUpdateUser) => updateUser(user),
    // 定义mutation成功执行后的回调函数，用于刷新相关的查询数据
    onSuccess:(data) => {
      // 刷新当前用户信息的查询
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER]
      });
      // 刷新指定用户ID的用户信息查询
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_USER_BY_ID,data?.$id]
      });
    }
  })
}