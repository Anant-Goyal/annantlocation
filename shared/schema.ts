import { z } from "zod";

export const userSettingsSchema = z.object({
  username: z.string().min(1, "Username is required"),
  includeLocation: z.boolean().default(true),
});

export type UserSettings = z.infer<typeof userSettingsSchema>;
