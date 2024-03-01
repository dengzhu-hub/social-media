import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useNavigate } from 'react-router-dom';

import { SignUpValidation } from '../../lib/validation/validation';
import { logo } from '../../public/assets/images'
import Loader from '@/components/shared/Loader';
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useCreateUserAccount, useSignAccount } from '@/react-query/queriesAndMutation';

import { useAuthUser } from '@/hooks/userContext';

const SignUp = () => {
    const { toast } = useToast();
    const { checkAuthUser, isLoading: isUserLoading } = useAuthUser();

    const { mutateAsync: createUser, isPending: isCreatingAccount } = useCreateUserAccount();
    const { mutateAsync: signInAccount, isPending: isSignInAccount } = useSignAccount();
    const navigate = useNavigate();
    // 1. Define your form.
    const form = useForm<z.infer<typeof SignUpValidation>>({
        resolver: zodResolver(SignUpValidation),
        defaultValues: {
            name: '',
            username: '',
            email: '',
            password: '',
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SignUpValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const newUser = createUser(values);
        if (!newUser) {
            return toast({
                description: "注册失败",
                title: "Error",
            }
            )
        }
        const session = await signInAccount({
            email: values.email,
            password: values.password
        });
        if (!session) {
             toast({
                description: "注册成功，即将跳转到登录页面",
                title: "Error",
            }
            );
            navigate('/sign-in');
            return;
        }
        const isLogin = await checkAuthUser();
        if (isLogin) {
            form.reset();
            navigate('/')
        } else {
            return toast({
                title: 'sign up failed, please try again.',
            })
        }
        console.log(newUser)
        console.log(values)
    }
    return (
        <Form {...form}>
            <div className='flex-col sm:w-420 flex-center '>
                <img src={logo} alt="" />
                <h2 className='pt-5 h3-bold md:h2-bold sm:pt-12'>create a new account</h2>
                <p className='mt-2 text-light-3 small-medium md:base-regular'>to use Snapgram enter your details</p>


                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-5 mt-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>name</FormLabel>
                                <FormControl>
                                    <Input type='text' className='shad-input' {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>userName</FormLabel>
                                <FormControl>
                                    <Input type='text' className='shad-input' {...field} />
                                </FormControl>
                                <FormDescription>
                This is your public display name.
              </FormDescription>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>email</FormLabel>
                                <FormControl>
                                    <Input type='email' className='shad-input' {...field} />
                                </FormControl>

                                <FormMessage className='' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>password</FormLabel>
                                <FormControl>
                                    <Input type='password' className='shad-input' {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className='uppercase shad-button_primary'>{
                        isCreatingAccount || isSignInAccount || isUserLoading ? (
                            <Loader children='loading...'></Loader>
                        ) : "sign up"}</Button>
                    <p className='mt-2 text-lg font-semibold leading-none'>Already have an account?<Link to="/sign-in" className='ml-2 font-bold uppercase text-primary-500'>Log in</Link></p>
                </form>
            </div>
        </Form>
    )
}

export default SignUp