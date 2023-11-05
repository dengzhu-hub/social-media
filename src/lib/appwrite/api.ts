import { INewUser, IUser } from "@/types";
import { account, appWriteConfig, avatars, database } from "./config";
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
export async function saveUserToDB(user: {
  accountId: string;
  name: string;
  username?: string;
  email: string;
  imageUrl: URL;
}) {
  try {
    const newUser = await database.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.userCollection,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
}

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
