import { INewPost, INewUser, IUpdatePost, IUpdateUser, IUser } from "@/types";
import { account, appWriteConfig, avatars, database, storage } from "./config";
import { AppwriteException, ID, Query } from "appwrite";
import { post } from "@/public/assets/icons";

export const createUser = async (user: INewUser) => {
  //TODO 黑暗时代卡
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw new Error("创建用户失败");
    const avatarUrl = avatars.getInitials(user.name);
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      username: user.username,
      email: newAccount.email,
      imageUrl: avatarUrl,
    });
    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
};
// 将用户保存到数据库的异步函数
export async function saveUserToDB(user: {
  accountId: string; // 用户账户ID
  name: string; // 用户姓名
  username?: string; // 用户名（可选）
  email: string; // 用户邮箱
  imageUrl: URL; // 用户头像URL
}) {
  try {
    // 在数据库中创建一个新的用户文档
    const newUser = await database.createDocument(
      appWriteConfig.databaseId, // 数据库ID
      appWriteConfig.userCollection, // 用户集合
      ID.unique(), // 用户ID（唯一）
      user // 用户信息
    );
    return newUser;
  } catch (error) {
    console.log(error); // 打印错误信息
  }
}

/**
 * 使用给定的邮箱和密码进行账号登录
 * @param user 包含邮箱和密码的对象
 * @returns 返回登录后的会话对象
 */
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
}
/**
 * 登出当前账户。
 *
 * @returns {Promise<string>} 登出结果。
 */
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取当前用户的信息
 * @returns {Promise<any>} 当前用户的信息
 */
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("获取当前账户不存在");
    const currentUser = await database.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.userCollection,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw new Error("当前用户不存在");
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

/**
 * 创建文章
 * @param post 文章信息
 */
export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw new Error(`文件上传失败`);
    const fileUrl = getFilePreviewUrl(uploadedFile.$id);
    if (!fileUrl) {
      throw new Error(`获取文件url失败`);
    }
    const tags = post?.tags?.replace(/ /g, "").split(",") || [];
    const newPost = await database.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollection,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        tags: tags,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
      }
    );
    if (!newPost) {
      deleteFile(uploadedFile.$id);
      throw new Error(`文章创建失败`);
    }
    return newPost;
  } catch (error) {
    console.log(error);
  }
}
export async function uploadFile(file: File) {
  try {
    // 创建并上传文件到存储服务
    const uploadFile = await storage.createFile(
      appWriteConfig.storageId, // 存储服务的ID
      ID.unique(), // 生成唯一的文件ID
      file // 要上传的文件
    );
    return uploadFile; // 返回上传后的文件对象
  } catch (error) {
    console.log(error); // 打印错误信息
  }
}

/**
 * 获取文件预览链接
 * @param fileId 文件ID
 * @returns 文件预览链接
 */
export function getFilePreviewUrl(fileId: string) {
  try {
    const filePreview = storage.getFilePreview(
      appWriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );
    return filePreview;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 删除文件
 * @param fileId - 文件ID
 * @returns - 无返回值
 */
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appWriteConfig.storageId, fileId);
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取最近的帖子
 * @returns {Promise<any[]>} 最近的帖子列表
 */
export async function getRecentPost() {
  try {
    // 从数据库中获取最近的帖子
    const recentPst = await database.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postCollection,
      [Query.orderDesc(`$createdAt`), Query.limit(20)]
    );

    if (!recentPst) throw new Error("获取最近的帖子失败");

    return recentPst;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    // 使用数据库对指定 postId 的文档进行更新，将 likes 字段设置为 likesArray
    const updatePost = await database.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollection,
      postId,
      {
        likes: likesArray,
      }
    );

    // 如果更新操作没有返回结果，则抛出错误
    if (!updatePost) throw new Error("");
    return updatePost;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 保存帖子
 * @param postId 帖子的ID
 * @param userId 用户的ID
 * @returns 保存成功的帖子信息
 */
export async function savePost(postId: string, userId: string) {
  try {
    const savePost = await database.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.saveCollection,
      ID.unique(),
      {
        postId,
        userId,
      }
    );
    if (!savePost) throw new Error("保存失败");
    return savePost;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 删除保存的记录
 * @param savedRecord 保存的记录的ID
 * @returns 删除结果对象
 */
export async function deleteSavePost(savedRecord: string) {
  try {
    const statusCode = await database.deleteDocument(
      appWriteConfig.databaseId,
      appWriteConfig.saveCollection,
      savedRecord
    );
    if (!statusCode) throw new Error("删除失败!");
    return { status: "success" };
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await database.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollection,
      postId
    );
    if (!post) throw new Error(`Could not find the post with id ${postId}`);
    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw new Error(`文件上传失败`);
      const fileUrl = getFilePreviewUrl(uploadedFile.$id);
      if (!fileUrl) {
        throw new Error(`获取文件url失败`);
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }
    const tags = post?.tags?.replace(/ /g, "").split(",") || [];
    const updatePost = await database.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollection,
      post.postId,
      {
        creator: post.postId,
        caption: post.caption,
        tags: tags,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
      }
    );
    if (!updatePost) {
      deleteFile(image.imageId);
      throw new Error(`文章创建失败`);
    }
    return updatePost;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 删除帖子及其对应的图片
 * @param postId - 帖子的ID
 * @param imageId - 图片的ID
 * @returns - 如果删除成功，返回{ status: "success" }对象；否则返回错误对象
 */
export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw new Error("参数错误");
  try {
    await database.deleteDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollection,
      postId
    );
    return { status: "success" };
  } catch (error) {
    console.log(error);
  }
}
export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await database.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postCollection,
      queries
    );

    if (!posts) throw new Error("读取文章失败");

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchItem: string) {
  try {
    const post = database.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postCollection,
      [Query.search("caption", searchItem)]
    );
    if (!post) throw new Error("获取帖子失败");
    return post;
  } catch (error) {
    console.log(error);
  }
}
