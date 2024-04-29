import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appWriteConfig, avatars, database, storage } from "./config";
import { ID, Query } from "appwrite";
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
/**
 * TODO: Remove
 * @param user
 * @returns
 */
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
    console.log(session);

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
    console.log(session);
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
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
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await database.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.userCollection,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
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

/**
 * 为指定的文章帖子添加喜欢。
 * @param postId 文章帖子的唯一标识符。
 * @param likesArray 包含喜欢该帖子的用户ID的数组。
 * @returns 返回更新后的帖子信息或者在发生错误时抛出异常。
 */
export async function likePost(postId: string, likesArray: string[]) {
  try {
    // 在数据库中更新指定 postId 的帖子，将 likes 字段设置为 likesArray
    const updatePost = await database.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollection,
      postId,
      {
        likes: likesArray,
      }
    );

    // 如果更新操作没有成功执行，则抛出错误
    if (!updatePost) throw new Error("更新失败!");
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
export async function savePost(userId: string, postId: string) {
  try {
    const savePost = await database.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.saveCollection,
      ID.unique(),
      {
        user: userId,
        post: postId,
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

/**
 * 更新文章信息
 * @param post 包含更新文章所需数据的对象，如图片、标签等
 * @returns 返回更新后的文章信息
 */
export async function updatePost(post: IUpdatePost) {
  // 检查是否有文件需要更新
  const hasFileToUpdate = post.file.length > 0;
  try {
    // 初始化image对象，包含当前的图片URL和ID
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };
    // 如果有文件需要更新，则执行文件上传
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      // 如果文件上传失败，抛出错误
      if (!uploadedFile) throw new Error(`文件上传失败`);
      // 获取上传文件的预览URL
      const fileUrl = getFilePreviewUrl(uploadedFile.$id);
      // 如果无法获取文件URL，抛出错误
      if (!fileUrl) {
        throw new Error(`获取文件url失败`);
      }
      // 更新image对象，使用新上传文件的URL和ID
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }
    // 处理文章标签，将其转换为数组形式
    const tags = post?.tags?.replace(/ /g, "").split(",") || [];
    // 更新数据库中的文章文档
    const updatePost = await database.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postCollection,
      post.postId,
      {
        caption: post.caption,
        tags: tags,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
      }
    );
    // 如果文章更新失败，删除已上传的文件并抛出错误
    if (!updatePost) {
      deleteFile(post.imageId);
      throw new Error(`文章创建失败`);
    }
    // 返回更新成功后的文章信息
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
export async function deletePost(postId?: string, imageId?: string) {
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

/**
 * 无限加载文章的异步函数。
 * @param {Object} 参数对象，包含一个必需的pageParam字段。
 * @param {number} pageParam 页码参数，用于指定要加载的文章页。
 * @returns 返回一个Promise，解析为文章帖子的数组。
 */
export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  // 初始化查询条件，包括按更新时间降序排列和限制返回的文章数量。
  const queries: string[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  // 如果提供了页码参数，则添加到查询条件中，用于分页。
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    // 执行数据库查询，获取文章列表。
    const posts = await database.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postCollection,
      queries
    );

    // 如果查询结果为空，抛出错误。
    if (!posts) throw Error;

    // 返回查询到的文章帖子。
    return posts;
  } catch (error) {
    // 捕获并记录查询过程中发生的任何错误。
    console.log(error);
  }
}

/**
 * 异步搜索帖子函数
 * @param searchItem 搜索关键字，用于查询帖子中包含该关键字的帖子
 * @returns 返回查询到的帖子列表。如果查询失败，将抛出异常
 */
// export async function searchPosts(searchItem: string) {
//   try {
//     // 使用提供的数据库ID和集合名称，以及搜索查询来获取帖子
//     const post = database.listDocuments(
//       appWriteConfig.databaseId,
//       appWriteConfig.postCollection,
//       [Query.search("caption", searchItem)]
//     );
//     if (!post) throw new Error("获取帖子失败"); // 如果未获取到帖子，抛出错误
//     return post; // 返回获取到的帖子
//   } catch (error) {
//     console.log(error); // 捕获并打印错误
//   }
// }

export async function searchPosts(searchItem: string) {
  try {
    // 使用提供的数据库ID和集合名称，以及搜索查询来获取帖子
    const post = await database.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postCollection,
      [Query.search("caption", searchItem)]
    );
    if (!post) throw new Error("获取帖子失败"); // 如果未获取到帖子，抛出错误
    return post; // 返回获取到的帖子
  } catch (error) {
    console.log(error); // 捕获并打印错误
    throw error; // 抛出错误以便上层调用者能够处理
  }
}

/**
 * 异步获取用户列表。
 * @param limit 可选参数，指定返回用户数量的最大值，默认为10。
 * @returns 返回用户文档的数组。如果未找到用户，抛出错误。
 */
export async function getUsers(limit?: number) {
  // 初始化查询条件，默认返回最近创建的10个用户
  const queries: string[] = [Query.orderDesc("$createdAt"), Query.limit(10)];
  // 如果指定了limit参数，则更新查询条件以返回指定数量的用户
  if (limit) queries.push(Query.limit(limit));
  try {
    // 从数据库中列出用户文档
    const users = await database.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.userCollection,
      queries
    );
    // 如果未找到用户，抛出错误
    if (!users) throw new Error("user not found");
    return users;
  } catch (error) {
    console.log(error); // 捕获并打印错误
  }
}

/**
 * 根据用户ID异步获取用户信息。
 *
 * @param userId 用户的唯一标识符。
 * @returns 返回一个Promise，解析为用户对象。如果找不到用户，则抛出错误。
 */
export async function getUserById(userId: string) {
  try {
    // 从数据库中获取指定ID的用户文档
    const user = await database.getDocument(
      appWriteConfig.databaseId,
      appWriteConfig.userCollection,
      userId
    );
    if (!user) throw new Error(`Could not find the user with id ${userId}`); // 如果未找到用户，抛出错误

    return user; // 返回找到的用户对象
  } catch (error) {
    console.log(error); // 捕获并打印错误
  }
}
/**
 * 更新用户信息。
 * @param user 包含要更新的用户信息的对象，可能包括新文件、用户名、简介等。
 * @returns 返回更新后的用户信息。
 */
export async function updateUser(user: IUpdateUser) {
  // 检查是否有文件需要更新
  const hasFileToUpdate = user.file.length > 0;
  try {
    // 初始化用户图片信息
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    // 如果有文件需要更新，则上传新文件到存储
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // 获取新文件的URL
      const fileUrl = getFilePreviewUrl(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      // 更新图片信息为新上传的文件
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // 更新用户文档
    const updatedUser = await database.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.userCollection,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // 更新失败时的处理逻辑
    if (!updatedUser) {
      // 如果有新文件上传，则删除它
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      throw Error; // 抛出错误
    }

    // 成功更新后，安全删除旧的图片文件
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser; // 返回更新后的用户信息
  } catch (error) {
    console.log(error); // 捕获并记录错误
  }
}
