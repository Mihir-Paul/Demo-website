import { z } from "zod";

export type GiftStatus = "DRAFT" | "PUBLISHED";
export type GiftTheme = "dreamy" | "romantic" | "celebration";

export interface PhotoInput {
  id?: string;
  url: string;
  caption?: string;
  order?: number;
}

export interface WishInput {
  id?: string;
  text: string;
  order?: number;
}

export interface GiftPhotoDraft {
  id: string;
  file?: File;
  previewUrl: string;
  caption: string;
  order: number;
}

export interface GiftBuilderState {
  recipientName: string;
  message: string;
  photos: GiftPhotoDraft[];
  letter: string;
  wishes: string[];
  theme: GiftTheme;
  pin: string;
  pinHint: string;
}

export interface CreateGiftInput {
  recipientName: string;
  message: string;
  letter?: string;
  theme?: string;
  pin?: string;
  pinHint?: string;
  photos?: PhotoInput[];
  wishes?: WishInput[];
}

// Zod schemas for API payload validation
export const CreateGiftSchema = z.object({
  recipientName: z.string().trim().min(1, "Recipient name is required").max(100),
  message: z.string().trim().min(1, "Main message is required").max(300),
  letter: z.string().max(3000, "Letter cannot exceed 3000 characters").optional(),
  theme: z.enum(["dreamy", "romantic", "celebration"]).default("dreamy"),
  pin: z.string().regex(/^\d{4}$/, "PIN must be exactly 4 numeric digits").optional().or(z.literal("")),
  pinHint: z.string().max(100).optional(),
  photos: z
    .array(
      z.object({
        id: z.string().optional(),
        url: z.string().min(1, "Photo URL required"),
        caption: z.string().optional(),
        order: z.number().int().optional(),
      })
    )
    .optional(),
  wishes: z
    .array(
      z.object({
        id: z.string().optional(),
        text: z.string().trim().min(1, "Wish text cannot be empty"),
        order: z.number().int().optional(),
      })
    )
    .optional(),
});

export const UnlockGiftSchema = z.object({
  pin: z.string().min(1, "PIN is required"),
});
