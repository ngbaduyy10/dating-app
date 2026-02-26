"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { TIME_WINDOWS, NUMBER_OF_DAYS, getDateKey, getSlotKey, formatDateLabel, TimeWindow } from "@/utils/constant";
import dayjs from "dayjs";
import CommonButton from "@/components/atoms/CommonButton";
import { toast } from "sonner";
import { saveMatchAvailability } from "@/lib/actions/match.action";
import useSWR from "swr";

type AvailabilitySlot = {
  date: string;
  block_type: TimeWindow["id"];
};

type AvailabilityApiResponse = {
  success: boolean;
  statusCode: number;
  data: {
    matched_user: {
      id: string;
      first_name: string;
      last_name: string;
    };
    slots: AvailabilitySlot[];
  };
};

const fetcher = async (url: string): Promise<AvailabilityApiResponse> => {
  const response = await fetch(url, { cache: "no-store" });
  return response.json();
};

export default function SchedulePage() {
  const params = useParams<{ matchId: string }>();
  const availabilityApiPath = `/api/match/${params.matchId}/availability`;

  const upcomingDays = useMemo(() => {
    const today = dayjs().startOf("day");

    return Array.from({ length: NUMBER_OF_DAYS }, (_, index) => {
      return today.add(index, "day");
    });
  }, []);

  const [selectedDateKey, setSelectedDateKey] = useState(getDateKey(upcomingDays[0]));
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const { data: availabilityResponse, isLoading: isAvailabilityLoading, mutate } = useSWR(
    availabilityApiPath,
    fetcher,
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    if (!availabilityResponse?.success) {
      return;
    }

    const nextSelectedSlots = new Set<string>(
      availabilityResponse.data.slots.map((slot) => getSlotKey(slot.date, slot.block_type)),
    );
    setSelectedSlots(nextSelectedSlots);
  }, [availabilityResponse]);

  const selectedCount = selectedSlots.size;
  const matchedUserName = availabilityResponse?.success
    ? `${availabilityResponse.data.matched_user.first_name} ${availabilityResponse.data.matched_user.last_name}`
    : params.matchId;

  const selectedSlotsInCurrentDay = useMemo(() => {
    return TIME_WINDOWS.filter((timeWindow) =>
      selectedSlots.has(getSlotKey(selectedDateKey, timeWindow.id)),
    );
  }, [selectedDateKey, selectedSlots]);

  const selectedByDate = useMemo(() => {
    const entries = upcomingDays
      .map((date) => {
        const dateKey = getDateKey(date);
        const windows = TIME_WINDOWS.filter((timeWindow) =>
          selectedSlots.has(getSlotKey(dateKey, timeWindow.id)),
        );
        return { dateKey, dateLabel: formatDateLabel(date), windows };
      })
      .filter((item) => item.windows.length > 0);

    return entries;
  }, [selectedSlots, upcomingDays]);

  const toggleSlot = (windowId: TimeWindow["id"]) => {
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      const slotKey = getSlotKey(selectedDateKey, windowId);
      if (next.has(slotKey)) {
        next.delete(slotKey);
      } else {
        next.add(slotKey);
      }
      return next;
    });
  };

  const clearCurrentDay = () => {
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      TIME_WINDOWS.forEach((timeWindow) =>
        next.delete(getSlotKey(selectedDateKey, timeWindow.id)),
      );
      return next;
    });
  };

  const clearAll = () => {
    setSelectedSlots(new Set());
  };

  const handleSave = async () => {
    const slots = Array.from(selectedSlots).map((slotKey) => {
      const [date, block_type] = slotKey.split("|") as [string, TimeWindow["id"]];
      return { date, block_type };
    });

    if (slots.length === 0) {
      toast.error("Please select at least one time block before saving.");
      return;
    }

    try {
      setIsSaving(true);
      const response = await saveMatchAvailability(params.matchId, slots);

      if (!response.success) {
        toast.error("Save failed. Please try again.");
        return;
      }

      toast.success(`Saved ${response.data.saved_count} time blocks.`);
      await mutate();
    } catch {
      toast.error("Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 min-h-full bg-white rounded-md shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Select Your Availability</h1>
          <p className="text-sm text-muted-foreground">
            Pick free time slots for the next 3 weeks to plan with user: {matchedUserName}
          </p>
          {isAvailabilityLoading && (
            <p className="text-xs text-muted-foreground mt-1">Loading saved availability...</p>
          )}
        </div>
        <CommonButton
          onClick={handleSave}
          disabled={isSaving}
          className="cursor-pointer shrink-0"
        >
          {isSaving ? "Saving..." : "Save"}
        </CommonButton>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
          {selectedCount} slots selected
        </span>
        <button
          type="button"
          onClick={clearCurrentDay}
          className="cursor-pointer text-sm px-3 py-1 rounded-md border border-border hover:bg-muted"
        >
          Clear selected day
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="cursor-pointer text-sm px-3 py-1 rounded-md border border-border hover:bg-muted"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">1) Choose a day</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {upcomingDays.map((date) => {
            const dateKey = getDateKey(date);
            const isActive = dateKey === selectedDateKey;

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => setSelectedDateKey(dateKey)}
                className={`cursor-pointer rounded-md border px-2 py-2 text-sm transition ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white hover:bg-muted border-border"
                }`}
              >
                {formatDateLabel(date)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">2) Choose time slots</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TIME_WINDOWS.map((timeWindow) => {
            const isSelected = selectedSlots.has(getSlotKey(selectedDateKey, timeWindow.id));

            return (
              <button
                key={timeWindow.id}
                type="button"
                onClick={() => toggleSlot(timeWindow.id)}
                className={`cursor-pointer rounded-md border px-2 py-2 text-sm transition ${
                  isSelected
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white hover:bg-muted border-border"
                }`}
              >
                <span className="font-medium">{timeWindow.label}</span>
                <span className="block text-xs opacity-80">{timeWindow.range}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Three blocks per day: Morning, Afternoon, and Evening.
        </p>
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <p className="text-sm font-medium">3) Review before saving</p>
        {selectedByDate.length === 0 ? (
          <p className="text-sm text-muted-foreground">No slots selected yet.</p>
        ) : (
          <div className="space-y-2">
            {selectedByDate.map((item) => (
              <div key={item.dateKey} className="rounded-md border border-border p-3">
                <p className="text-sm font-medium mb-1">{item.dateLabel}</p>
                <p className="text-sm text-muted-foreground">
                  {item.windows.map((window) => window.label).join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
        {selectedSlotsInCurrentDay.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Selected day has {selectedSlotsInCurrentDay.length} slots.
          </p>
        )}
      </div>
    </div>
  );
}