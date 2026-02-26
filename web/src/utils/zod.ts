import { z } from "zod";
import { Gender } from "@/types";

export const registerFormSchema = z
  .object({
    firstName: z
      .string()
      .nonempty("First Name is required")
      .min(2, "First Name must be at least 2 characters long")
      .max(20, "First Name must be at most 20 characters long")
      .regex(/^[a-zA-Z]+$/, "First Name can only contain letters"),
    lastName: z
      .string()
      .nonempty("Last Name is required")
      .min(2, "Last Name must be at least 2 characters long")
      .max(20, "Last Name must be at most 20 characters long")
      .regex(/^[a-zA-Z]+$/, "Last Name can only contain letters"),
    email: z.email("Invalid email format"),
    age: z
      .number({ message: "Age must be a number" })
      .int("Age must be an integer")
      .min(18, "Age must be at least 18")
      .max(100, "Age must be at most 100"),
    gender: z.enum(Gender, {
      message: "Gender is required",
    }),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .nonempty("Confirm Password is required")
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;

export const loginFormSchema = z.object({
  email: z.email("Invalid email format"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;