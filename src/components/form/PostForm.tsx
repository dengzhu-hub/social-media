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
import { useCreatePost } from "@/react-query/queriesAndMutation"
import { useAuthUser } from "@/hook/userContext"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../ui/use-toast"

type PostFormProps = {
    post?: Models.Document;
    action: 'CREATE' | 'UPDATE';

}

const PostForm = ({ post, action }: PostFormProps) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    const { user } = useAuthUser();
    const { mutateAsync: createPost, isPending: isUserCreatedPost } = useCreatePost();

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-w-5xl gap-9 w-full flex-col justify-center  ">
                <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">caption</FormLabel>
                            <FormControl>
                                <Textarea className="shad-textarea custom-scrollbar" placeholder="shadcn" {...field} />
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
                                <Input type="text" className="shad-input" placeholder="javascript nextJs react"  {...field} />
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
                                <Input type="text" className="shad-input"   {...field} />
                            </FormControl>

                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />



                <div className="flex gap-4 justify-end items-center">
                    <Button type="button" className="capitalize shad-button_dark_4">cancel</Button>
                    <Button type="submit" className="capitalize shad-button_primary whitespace-nowrap">submit</Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm