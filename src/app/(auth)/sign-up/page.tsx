"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ApiResponse } from "@/types/ApiResponse";
import { signupSchema, SignupFormData } from "@/schemas/signUpSchema";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

export default function SignUpForm() {
  const router = useRouter();

  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),

    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const debouncedCheckUsername = useDebounceCallback(async (value: string) => {
    const username = value.trim();

    if (!username) {
      setUsernameMessage("");
      setIsCheckingUsername(false);
      return;
    }

    setIsCheckingUsername(true);
    setUsernameMessage("");

    try {
      const response = await axios.get<ApiResponse>(
        `/api/check-username-unique?username=${encodeURIComponent(username)}`,
      );

      setUsernameMessage(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      setUsernameMessage(
        axiosError.response?.data?.message ?? "Error checking username",
      );
    } finally {
      setIsCheckingUsername(false);
    }
  }, 500);

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);

    try {
      // confirmPassword is ONLY for frontend validation.
      // It is NOT sent to the backend.
      const signupData = {
        username: data.username.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };

      const response = await axios.post<ApiResponse>(
        "/api/sign-up",
        signupData,
      );

      toast.success(response.data.message ?? "Account created successfully!");

      router.push(`/verify/${encodeURIComponent(data.username)}`);
    } catch (error) {
      console.error("SIGN UP ERROR:", error);

      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage =
        axiosError.response?.data?.message ??
        "There was a problem with your sign-up. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: any) => {
    console.log("VALIDATION ERRORS:", errors);

    const firstError =
      errors.username?.message ||
      errors.email?.message ||
      errors.password?.message ||
      errors.confirmPassword?.message ||
      "Please fix the errors in the form.";

    toast.error(firstError);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Join True Feedback
          </h1>

          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-6"
          noValidate
        >
          {/* Username */}
          <Controller
            name="username"
            control={form.control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="username">Username</FieldLabel>

                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    autoComplete="username"
                    value={field.value ?? ""}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    aria-invalid={fieldState.invalid}
                    onChange={(event) => {
                      const value = event.target.value;

                      field.onChange(value);
                      setUsernameMessage("");

                      debouncedCheckUsername(value);
                    }}
                  />

                  {isCheckingUsername && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-500" />
                  )}
                </div>

                {!isCheckingUsername && usernameMessage && (
                  <p
                    className={`text-sm ${
                      usernameMessage === "Username is unique"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                )}

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={form.control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  aria-invalid={fieldState.invalid}
                />

                <p className="text-sm text-gray-400">
                  We will send you a verification code
                </p>

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={form.control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  autoComplete="new-password"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  aria-invalid={fieldState.invalid}
                />

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          {/* Confirm Password */}
          <Controller
            name="confirmPassword"
            control={form.control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>

                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  aria-invalid={fieldState.invalid}
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
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
