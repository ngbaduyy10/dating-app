import { Bell, Calendar, Home } from "lucide-react";
import { Dayjs } from "dayjs";

export const navigationItems = [
  { id: "home", href: "/", label: "Home", icon: Home },
  { id: "matches", href: "/match", label: "Matches", icon: Bell },
  { id: "schedule", href: "/schedule", label: "Schedule", icon: Calendar },
];

export const NUMBER_OF_DAYS = 21;
export const TIME_WINDOWS = [
  { id: "morning", label: "Morning", range: "08:00 - 12:00" },
  { id: "afternoon", label: "Afternoon", range: "13:00 - 17:00" },
  { id: "evening", label: "Evening", range: "18:00 - 22:00" },
] as const;

export type TimeWindow = (typeof TIME_WINDOWS)[number];

export function getDateKey(date: Dayjs) {
  return date.format("YYYY-MM-DD");
}

export function formatDateLabel(date: Dayjs) {
  return date.format("ddd, MM/DD");
}

export function getSlotKey(dateKey: string, windowId: TimeWindow["id"]) {
  return `${dateKey}|${windowId}`;
}