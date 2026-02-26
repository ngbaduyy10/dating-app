"use server";

import { ApiResponse } from "@/dto/apiResponse.dto";
import { TimeWindow } from "@/utils/constant";
import { fetchApiWithAuth } from "@/utils/api";

export interface SaveAvailabilitySlot {
  date: string;
  block_type: TimeWindow["id"];
}

export async function saveMatchAvailability(
  matchId: string,
  slots: SaveAvailabilitySlot[],
) {
  try {
    return (await fetchApiWithAuth(`/match/${matchId}/availability`, {
      method: "PUT",
      body: { slots },
    })) as ApiResponse<{ saved_count: number }>;
  } catch {
    return {
      success: false,
      statusCode: 500,
      data: { saved_count: 0 },
    } as ApiResponse<{ saved_count: number }>;
  }
}
