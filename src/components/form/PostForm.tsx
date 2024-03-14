import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "../shared/FileUpload";
import { Input } from "@/components/ui/input";
import { PostValidation } from "@/lib/validation/validation"
import { Models } from "appwrite"
import { useCreatePost, useUpdatePost } from "@/react-query/queriesAndMutation"
import { useAuthUser } from "@/hooks/userContext"
import { useNavigate } from "react-router-dom"
import { useToast } from "../ui/use-toast"
import Loader from "@/components/shared/Loader";
type PostFormProps = {
    post?: Models.Document;
    action: 'Create' | 'Update';
}

const PostForm = ({ post, action }: PostFormProps) => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const { user } = useAuthUser();
    const { mutateAsync: createPost, isPending: isUserCreatedPost } = useCreatePost();
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();
    console.log(isLoadingUpdate, isUserCreatedPost)

    // 1. Define your form.
    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post ? post?.caption : "",
            file: [],
            location: post ? post?.location : "",
            tags: post ? post?.tags.join('') : '',
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PostValidation>) {
        console.log('didSubmit');
        if (post && action === 'Update') {
            const updatePosts = await updatePost({
                ...values,
                postId: post.$id,
                imageId: post?.imageId,
                imageUrl: post?.imageUrl,
            })
            if (!updatePosts) {
                toast({
                    title: 'Error',
                    description: 'Error updating post'
                })
            }
            return navigate(`/post/${post.$id}`);
        }

        try {
            // Do something with the form values.
            // ✅ This will be type-safe and validated.
            const newPost = await createPost({
                ...values,
                userId: user.id,
            });
            console.log(newPost)

            if (!newPost) {
                toast({
                    description: 'Something went wrong',
                    title: 'Error',
                });
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast({
                description: 'An error occurred while creating the post',
                title: 'Error',
            });
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center w-full max-w-5xl gap-9 ">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">caption</FormLabel>
                            <FormControl>
                                <Textarea className="shad-textarea custom-scrollbar" placeholder="分享你的想法..." {...field} />
                            </FormControl>

                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">addPost</FormLabel>
                            <FormControl>
                                <FileUpload
                                    fileChange={field.onChange}
                                    mediaUrl={post?.imageUrl} />
                            </FormControl>

                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">addTags(separated by comma ",")</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" placeholder="输入您想要添加的标签..."  {...field} />
                            </FormControl>

                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">add location</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input"   placeholder="告诉我们您在哪里..." {...field} />
                            </FormControl>

                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />



                <div className="flex items-center justify-end gap-4">
                    <Button type="button" onClick={() => {navigate(-1)}} className="capitalize shad-button_dark_4">cancel</Button>
                    <Button type="submit" className="capitalize shad-button_primary whitespace-nowrap" 
                    disabled={isLoadingUpdate || isUserCreatedPost}>
                        {(isLoadingUpdate || isUserCreatedPost) && (<Loader children='' />)} 
                        {action} post</Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm