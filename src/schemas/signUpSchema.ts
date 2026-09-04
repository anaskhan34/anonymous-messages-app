import { z } from "zod";

export const signupSchema = z
  .object({
    username: z.string().min(2, "Name must be at least 2 characters"),

    email: z.email("Enter a valid email"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
