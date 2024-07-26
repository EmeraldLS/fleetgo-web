import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // Full name of the day
    year: "numeric", // Full year
    month: "long", // Full name of the month
    day: "numeric", // Day of the month
    hour: "numeric", // Hour
    minute: "numeric", // Minute
    hour12: true, // Use 12-hour clock
  };

  const formattedDate = new Date(date).toLocaleString("en-US", options);
  return formattedDate;
};
