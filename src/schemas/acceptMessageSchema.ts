import { z } from "zod";

export const acceptMessagesSchema = z.object({
  isAcceptingMessages: z.boolean(),
});

export type AcceptMessagesData = z.infer<typeof acceptMessagesSchema>;
