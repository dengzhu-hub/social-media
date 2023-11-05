import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from 'react-router-dom';

import { SignInValidation, SignUpValidation } from '../../lib/validation';
import { logo } from '../../public/assets/images'
import Loader from '@/components/shared/Loader';
import { Link } from 'react-router-dom';
import { createUser } from '@/lib/appwrite/api';
import { useToast } from "@/components/ui/use-toast";
import { useCreateUserAccount, useSignAccount } from '@/react-query/queriesAndMutationa';
import { useUserContext } from '@/context/AuthContext';
import { useAuthUser } from '@/hook/userContext';

const SignIn = () => {
  const { toast } = useToast();
  const { checkAuthUser } = useAuthUser();
  const { mutateAsync: signInAccount, isPending: isUserLoading } = useSignAccount();
  const navigate = useNavigate();
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const session = await signInAccount({
      email: values.email,
      password: values.password
    });
    if (!session) {
      return toast({
        description: "sign in failed, please try again.",
        title: "Error",
      }
      )
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
  }
  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col '>
        <img src={logo} alt="" />
        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>login to your account</h2>
        <p className='text-light-3 small-medium md:base-regular mt-2'>to use Snapgram enter your details</p>


        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input type='email' className='shad-input' {...field} />
                </FormControl>

                <FormMessage />
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
          <Button type="submit" className='shad-button_primary uppercase'>{
            isUserLoading ? (
              <Loader children='loading...'></Loader>
            ) : "sign in"}</Button>
          <p className='mt-2 text-lg leading-none font-semibold'>don't have an account?<Link to="/sign-up" className='text-primary-500 ml-2 font-bold  uppercase'>sign up</Link></p>
        </form>
      </div>
    </Form>
  )
}

export default SignIn