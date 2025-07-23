import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string(),
  name: z.string(),
});

export const siginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string(),
});

export const roomSchema = z.object({
  name: z.string().min(5).max(20),
});
