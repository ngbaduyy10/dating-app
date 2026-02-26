import MatchCard, { ScheduleMatch } from "@/components/molecules/MatchCard";
import { ApiResponse } from "@/dto/apiResponse.dto";
import { fetchApiWithAuth } from "@/utils/api";

export default async function SchedulePage() {
  const response = (await fetchApiWithAuth("/match", {
    method: "GET",
    cache: "no-store",
  })) as ApiResponse<ScheduleMatch[]>;
  const blockOrder = { morning: 1, afternoon: 2, evening: 3 } as const;
  const scheduledMatches = (response.data ?? [])
    .filter((match) => match.status === "scheduled")
    .sort((a, b) => {
      const dateA = a.first_common_date ?? "9999-12-31";
      const dateB = b.first_common_date ?? "9999-12-31";
      if (dateA !== dateB) {
        return dateA.localeCompare(dateB);
      }

      const blockA = a.first_common_block_type
        ? blockOrder[a.first_common_block_type]
        : Number.MAX_SAFE_INTEGER;
      const blockB = b.first_common_block_type
        ? blockOrder[b.first_common_block_type]
        : Number.MAX_SAFE_INTEGER;
      return blockA - blockB;
    });

  return (
    <div className="p-4 min-h-full bg-white rounded-md shadow-sm">
      <h1 className="text-3xl font-semibold mb-4">Schedule</h1>

      {scheduledMatches.length === 0 ? (
        <p className="text-muted-foreground">No scheduled matches yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {scheduledMatches.map((match) => (
            <MatchCard key={match.match_id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}