import { fetchApiWithAuth } from "@/utils/api";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ matchId: string }> },
) {
  const { matchId } = await context.params;
  try {
    const response = await fetchApiWithAuth(`/match/${matchId}/availability`, {
      method: "GET",
      cache: "no-store",
    });
    
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { success: false, statusCode: 401, data: [] },
      { status: 401 },
    );
  }
}
