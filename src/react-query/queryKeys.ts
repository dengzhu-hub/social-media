/**
 * An enum containing all the possible query keys used in the application.
 */
export enum QUERY_KEYS {
  /**
   * A query key for getting recent posts.
   */
  GET_RECENT_POSTS = "getCurrentPost",
  /**
   * A query key for getting a post by its ID.
   */
  GET_POST_BY_ID = "getPostById",
  /**
   * A query key for getting the current user.
   */
  GET_CURRENT_USER = "getCurrentUser",
  /**
   * A query key for getting all users.
   */
  GET_USERS='getUsers',
  /**
   * A query key for getting a single post.
   */
  GET_POST = "getPost,",
  /**
   * A query key for searching posts.
   */
  search_post= 'searchPosts',
  /**
   * A query key for getting a user by its ID.
   */
  GET_USER_BY_ID='getUserByID',
  /**
   * A query key for getting infinite posts.
   */
  GET_INFINITE_POSTS = "getInfinitePosts",
}