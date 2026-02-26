"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

const NUMBER_OF_DAYS = 21;
const START_HOUR = 8;
const END_HOUR = 22;
const STEP_MINUTES = 60;

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

function createTimeSlots() {
  const totalMinutes = (END_HOUR - START_HOUR) * 60;
  const totalSteps = totalMinutes / STEP_MINUTES;

  return Array.from({ length: totalSteps }, (_, index) => {
    const minutesFromStart = index * STEP_MINUTES;
    const hour = START_HOUR + Math.floor(minutesFromStart / 60);
    const minute = minutesFromStart % 60;
    return `${pad(hour)}:${pad(minute)}`;
  });
}

function getSlotKey(dateKey: string, time: string) {
  return `${dateKey}|${time}`;
}

export default function SchedulePage() {
  const params = useParams<{ matchId: string }>();

  const upcomingDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Array.from({ length: NUMBER_OF_DAYS }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return date;
    });
  }, []);

  const timeSlots = useMemo(() => createTimeSlots(), []);
  const [selectedDateKey, setSelectedDateKey] = useState(getDateKey(upcomingDays[0]));
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  const selectedCount = selectedSlots.size;

  const selectedSlotsInCurrentDay = useMemo(() => {
    return timeSlots.filter((time) => selectedSlots.has(getSlotKey(selectedDateKey, time)));
  }, [selectedDateKey, selectedSlots, timeSlots]);

  const selectedByDate = useMemo(() => {
    const entries = upcomingDays
      .map((date) => {
        const dateKey = getDateKey(date);
        const times = timeSlots.filter((time) => selectedSlots.has(getSlotKey(dateKey, time)));
        return { dateKey, dateLabel: formatDateLabel(date), times };
      })
      .filter((item) => item.times.length > 0);

    return entries;
  }, [selectedSlots, timeSlots, upcomingDays]);

  const toggleSlot = (time: string) => {
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      const slotKey = getSlotKey(selectedDateKey, time);
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
      timeSlots.forEach((time) => next.delete(getSlotKey(selectedDateKey, time)));
      return next;
    });
  };

  const clearAll = () => {
    setSelectedSlots(new Set());
  };

  return (
    <div className="p-4 h-full bg-white rounded-md shadow-sm space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Select Your Availability</h1>
        <p className="text-sm text-muted-foreground">
          Pick free time slots for the next 3 weeks to plan with user: {params.matchId}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
          {selectedCount} slots selected
        </span>
        <button
          type="button"
          onClick={clearCurrentDay}
          className="text-sm px-3 py-1 rounded-md border border-border hover:bg-muted"
        >
          Clear selected day
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="text-sm px-3 py-1 rounded-md border border-border hover:bg-muted"
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
                className={`rounded-md border px-2 py-2 text-sm transition ${
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
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {timeSlots.map((time) => {
            const isSelected = selectedSlots.has(getSlotKey(selectedDateKey, time));

            return (
              <button
                key={time}
                type="button"
                onClick={() => toggleSlot(time)}
                className={`rounded-md border px-2 py-2 text-sm transition ${
                  isSelected
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white hover:bg-muted border-border"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Each slot is {STEP_MINUTES} minutes. You can select multiple slots in the same day.
        </p>
      </div>

      <div className="border-t pt-4 space-y-2">
        <p className="text-sm font-medium">3) Review before saving</p>
        {selectedByDate.length === 0 ? (
          <p className="text-sm text-muted-foreground">No slots selected yet.</p>
        ) : (
          <div className="space-y-2">
            {selectedByDate.map((item) => (
              <div key={item.dateKey} className="rounded-md border p-3">
                <p className="text-sm font-medium mb-1">{item.dateLabel}</p>
                <p className="text-sm text-muted-foreground">{item.times.join(", ")}</p>
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