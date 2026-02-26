"use server";

import { ApiResponse } from "@/dto/apiResponse.dto";
import { fetchApiWithAuth } from "@/utils/api";

export async function likeUser(userId: string) {
  try {
    return (await fetchApiWithAuth(`/user/${userId}/like`, {
      method: "POST",
    })) as ApiResponse<{ isMatch: boolean }>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      data: { isMatch: false },
    } as ApiResponse<{ isMatch: boolean }>;
  }
}
