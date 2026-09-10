"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signInSchema, SignInFormData } from "@/schemas/signInSchema";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

export default function SignInForm() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier.trim(),
        password: data.password,
      });

      if (!result) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (result.error) {
        if (result.error === "CredentialsSignin") {
          toast.error("Incorrect username/email or password.");
        } else {
          toast.error(result.error);
        }

        return;
      }

      if (result.ok) {
        toast.success("Signed in successfully!");

        router.replace("/dashboard");
      } else {
        toast.error("Unable to sign in. Please try again.");
      }
    } catch (error) {
      console.error("SIGN IN ERROR:", error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: any) => {
    console.log("VALIDATION ERRORS:", errors);

    const firstError =
      errors.identifier?.message ||
      errors.password?.message ||
      "Please fix the errors in the form.";

    toast.error(firstError);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Welcome Back to True Feedback
          </h1>

          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>

        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-6"
          noValidate
        >
          {/* Identifier */}
          <Controller
            name="identifier"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="identifier">Email / Username</FieldLabel>

                <Input
                  {...field}
                  id="identifier"
                  type="text"
                  placeholder="Enter email or username"
                  autoComplete="username"
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                />

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <Input
                  {...field}
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                />

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Sign Up */}
        <div className="mt-4 text-center">
          <p>
            Not a member yet?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
