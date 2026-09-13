import { z } from "zod";

export type GiftStatus = "DRAFT" | "PUBLISHED";

export interface PhotoInput {
  url: string;
  caption?: string;
  order?: number;
}

export interface WishInput {
  text: string;
  order?: number;
}

export interface CreateGiftInput {
  recipientName: string;
  message: string;
  letter?: string;
  theme?: string;
  pin?: string;
  photos?: PhotoInput[];
  wishes?: WishInput[];
}

export interface UpdateGiftInput {
  recipientName?: string;
  message?: string;
  letter?: string;
  theme?: string;
  pin?: string;
  photos?: PhotoInput[];
  wishes?: WishInput[];
}

// Zod schemas for API payload validation
export const CreateGiftSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required").max(100),
  message: z.string().min(1, "Message is required"),
  letter: z.string().optional(),
  theme: z.string().default("sunset-glow"),
  pin: z.string().min(4).max(8).optional().or(z.literal("")),
  photos: z
    .array(
      z.object({
        url: z.string().url("Invalid image URL"),
        caption: z.string().optional(),
        order: z.number().int().optional(),
      })
    )
    .optional(),
  wishes: z
    .array(
      z.object({
        text: z.string().min(1),
        order: z.number().int().optional(),
      })
    )
    .optional(),
});

export const UnlockGiftSchema = z.object({
  pin: z.string().min(1, "PIN is required"),
});
