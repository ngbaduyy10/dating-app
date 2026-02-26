"use client";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, LoginFormData } from "@/utils/zod";
import { useState } from "react";
import CustomFormControl from "@/components/molecules/CustomFormControl";
import LoadingCircle from "@/components/atoms/LoadingCircle";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import { toast } from "sonner";
import CommonButton from "@/components/atoms/CommonButton";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (!response.error) {
        router.push("/");
        setTimeout(() => {
          toast.success("Login successful!");
        }, 500);
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
          <CustomFormControl
            control={form.control}
            name={"email"}
            label={"Email"}
            type={"text"}
            placeholder={"e.g. john.doe@example.com"}
            icon={Mail}
            classNameInput="h-11"
          />
          <CustomFormControl
            control={form.control}
            name={"password"}
            label={"Password"}
            type={"password"}
            placeholder={"*********"}
            icon={Lock}
            classNameInput="h-11"
          />
          <CommonButton 
            type="submit" 
            disabled={loading} 
            className="w-full mt-2"
          >
            <LoadingCircle loading={loading}>Sign In</LoadingCircle>
          </CommonButton>
        </form>
      </Form>
      <p className="text-sm text-muted-foreground mt-2">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-black hover:underline cursor-pointer">
          Sign Up
        </Link>
      </p>
    </>
  )
}