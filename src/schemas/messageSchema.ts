import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Message cannot be empty")
    .max(300, "Message is too long"),
});

export type MessageData = z.infer<typeof messageSchema>;
