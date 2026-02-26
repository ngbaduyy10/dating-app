import CommonButton from "@/components/atoms/CommonButton";
import { Badge } from "@/components/ui/badge";
import User from "@/models/user";
import dayjs from "dayjs";

type MatchStatus = "matched" | "scheduled" | "no_common_slot";

export interface ScheduleMatch extends User {
  match_id: string;
  status: MatchStatus;
  first_common_date?: string;
  first_common_block_type?: "morning" | "afternoon" | "evening";
}

interface MatchCardProps {
  match: ScheduleMatch;
}

function getStatusBadgeConfig(status: MatchStatus) {
  if (status === "scheduled") {
    return { label: "Scheduled", className: "bg-emerald-500 text-white" };
  }

  if (status === "no_common_slot") {
    return { label: "No common slot", className: "bg-amber-500 text-white" };
  }

  return { label: "Matched", className: "bg-primary text-primary-foreground" };
}

export default function MatchCard({ match }: MatchCardProps) {
  const status = getStatusBadgeConfig(match.status);
  const blockLabel =
    match.first_common_block_type === "morning"
      ? "Morning"
      : match.first_common_block_type === "afternoon"
        ? "Afternoon"
        : match.first_common_block_type === "evening"
          ? "Evening"
          : null;
  const blockRange =
    match.first_common_block_type === "morning"
      ? "08:00 - 12:00"
      : match.first_common_block_type === "afternoon"
        ? "13:00 - 17:00"
        : match.first_common_block_type === "evening"
          ? "18:00 - 22:00"
          : null;
  const scheduleText =
    match.first_common_date && blockLabel && blockRange
      ? `${dayjs(match.first_common_date).format("ddd, MMM DD")} • ${blockLabel} (${blockRange})`
      : "No scheduled slot";

  return (
    <div className="rounded-lg border border-border bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold">
            {match.first_name} {match.last_name}
          </p>
          <p className="text-sm text-muted-foreground">{match.email}</p>
        </div>
        <Badge className={status.className}>{status.label}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{scheduleText}</p>

      <CommonButton href={`/schedule/${match.match_id}`} className="cursor-pointer">
        Rearrange schedule
      </CommonButton>
    </div>
  );
}