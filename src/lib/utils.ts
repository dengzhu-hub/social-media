import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 将一组类名合并为一个字符串
 *
 * @param {...ClassValue[]} inputs - 一组类名
 * @returns {string} 合并后的字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 根据给定的日期字符串返回时间间隔
 * @param {string} date - 日期字符串，格式为yyyy-MM-ddTHH:mm:ss.sssZ
 * @returns {string} - 时间间隔，格式为x分钟前或刚刚
 */
export function timeAgo(dateString: string): string {
  const currentDate = new Date();
  const date = new Date(dateString);

  const seconds = Math.floor((currentDate.getTime() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, "年"],
    [2592000, "月"],
    [86400, "天"],
    [3600, "小时"],
    [60, "分钟"],
    [1, "秒"],
  ];

  for (const [secondsInterval, unit] of intervals) {
    const interval = Math.floor(seconds / secondsInterval);

    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""}前`;
    }
  }

  return "刚刚";
}

/**
 * 检查当前用户是否已点赞
 * @param likesArray 用户的点赞数组
 * @param userId 当前用户的ID
 * @returns 如果likesArray中包含userId，则返回true，否则返回false
 */
export const checkedIsLiked = (likesArray: string[], userId: string) => {
  return likesArray.includes(userId);
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);