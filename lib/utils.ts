import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 외부 이미지용 blur placeholder (로딩 중 회색 블러 표시)
export const BLUR_DATA_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='30'%3E%3Cdefs%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='12'/%3E%3C/filter%3E%3C/defs%3E%3Crect filter='url(%23b)' width='100%25' height='100%25' fill='%23888'/%3E%3C/svg%3E"
