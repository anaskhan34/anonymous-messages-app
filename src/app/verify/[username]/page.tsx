"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ApiResponse } from "@/types/ApiResponse";
import { verifySchema, VerifyFormData } from "@/schemas/verifySchema";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: VerifyFormData) => {
    setIsSubmitting(true);

    try {
      const username = decodeURIComponent(params.username);

      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username,
        code: data.code,
      });

      toast.success(response.data.message ?? "Account verified successfully!");

      router.replace("/sign-in");
    } catch (error) {
      console.error("VERIFY CODE ERROR:", error);

      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage =
        axiosError.response?.data?.message ??
        "Verification failed. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: any) => {
    console.log("VALIDATION ERRORS:", errors);

    const firstError =
      errors.code?.message ?? "Please enter a valid verification code.";

    toast.error(firstError);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Verify Your Account
          </h1>

          <p className="mb-4 text-gray-600">
            Enter the verification code sent to your email.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-6"
          noValidate
        >
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="code">Verification Code</FieldLabel>

                <Input
                  {...field}
                  id="code"
                  type="text"
                  placeholder="Enter verification code"
                  autoComplete="one-time-code"
                  aria-invalid={fieldState.invalid}
                  disabled={isSubmitting}
                />

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Account"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
