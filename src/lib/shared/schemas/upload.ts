import { z } from "zod";

export const uploadPhotoSchema = z.object({
  photo: z.instanceof(File, { message: "Photo is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "File must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Invalid format. Use JPEG, PNG or WebP"
    ),
  isMain: z.string().optional().transform((val) => val === "true"),
});

export type UploadPhotoInput = z.infer<typeof uploadPhotoSchema>;
