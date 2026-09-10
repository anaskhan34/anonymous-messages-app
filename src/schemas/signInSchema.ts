import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string().min(1, "Username or email is required").trim(),

  password: z.string().min(1, "Password is required"),
});

export type SignInFormData = z.infer<typeof signInSchema>;
