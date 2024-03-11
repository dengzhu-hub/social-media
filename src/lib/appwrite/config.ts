import { Client, Account, Avatars, Databases, Storage } from "appwrite";
export const appWriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  url: import.meta.env.VITE_APPWRITE_PROJECT_URL,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  userCollection: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
  saveCollection: import.meta.env.VITE_APPWRITE_SAVE_COLLECTION_ID,
  postCollection: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
};
const client = new Client();
export const account = new Account(client);
export const avatars = new Avatars(client);
export const database = new Databases(client);
export const storage = new Storage(client);

/**
 * 设置项目ID
 * @param projectId 项目ID-6 
 */
client.setProject(appWriteConfig.projectId);

/**
 * 设置端点URL
 * @param url 端点URL
 */
client.setEndpoint(appWriteConfig.url);