"use server";

import { fetchApi } from "@/utils/api";
import { registerFormSchema, RegisterFormData } from "@/utils/zod";

export async function registerUser(formData: RegisterFormData) {
    const validatedData = registerFormSchema.parse(formData);
    
    const response = await fetchApi("/auth/register", {
      method: "POST",
      body: {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        age: validatedData.age,
        gender: validatedData.gender,
        password: validatedData.password,
      },
    });

    return response;
}