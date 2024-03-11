import { checkedIsLiked } from "@/lib/utils";
import { like, save, liked, saved } from "@/public/assets/icons";
import { useDeleteSavePost, useGetCurrentUser, useLikePost, useSavePost } from "@/react-query/queriesAndMutation";
import { Models } from "appwrite";
import { useState, useEffect } from 'react';
import Loader from "./Loader";
import { useLocation } from "react-router-dom";
type PostStatsProps = {
    post: Models.Document,
    userId: string;
}

const PostStats = ({ post, userId }: PostStatsProps) => {
    const likesArray: string[] = post?.likes.map((like: Models.Document) => like.$id);
    const [likes, setLikes] = useState<string[]>(likesArray);
    const [isSaved, setIsSaved] = useState<boolean>(false)
    const { mutate: likePost } = useLikePost();
    const location = useLocation();
    
    const { mutate: savePost, isPending: isSavePostPending } = useSavePost();
    const { mutate: deleteSavePost, isPending: isDeleteSavePostPending } = useDeleteSavePost();
    const { data: currentUser } = useGetCurrentUser();
    const hasSaveRecord = currentUser?.save.find((record: Models.Document) => record?.post?.$id === post?.$id);
    useEffect(() => {
        setIsSaved(!!hasSaveRecord)
    }, [currentUser])

    const handleLikePost = (
        e: React.MouseEvent<HTMLImageElement, MouseEvent>
    ) => {
        e.stopPropagation();

        let likesArray = [...likes];

        if (likesArray.includes(userId)) {
            likesArray = likesArray.filter((Id) => Id !== userId);
        } else {
            likesArray.push(userId);
        }

        setLikes(likesArray);
        likePost({ postId: post?.$id || '', likesArray });
    };

    const handleSaveLikePost = (e: React.MouseEvent<HTMLImageElement,MouseEvent>) => {
        e.stopPropagation();
        console.log('handleLikePost');

        if (hasSaveRecord) {
            setIsSaved(false);
            return deleteSavePost(hasSaveRecord.$id);
        } 
            savePost({ userId: userId,postId:post.$id });
            setIsSaved(true);

        

    }
    const containerStyles = location.pathname.startsWith('/profile') ? 'w-full' : ''
    return (
        <div className={`z-20 flex items-center justify-between mt-4 ${containerStyles}`}>

            <div className="flex gap-2 mr-5 ">
                <img width={20} height={20} src={`${checkedIsLiked(likesArray, userId) ? liked : like}`} alt="like post" onClick={handleLikePost} className="cursor-pointer" />
                <p className=" small-medium lg:base-medium" >{likes.length}</p>
            </div>

            <div>
                {isSavePostPending || isDeleteSavePostPending ? <Loader children=''></Loader> : <img src={`${isSaved ? saved : save}`} alt="" onClick={handleSaveLikePost} className="cursor-pointer" width={20} height={20} />}
            </div>
        </div>
    )
}

export default PostStats