import * as z from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  userName: z.string().min(3, "Username must be at least 3 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
