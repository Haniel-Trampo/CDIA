import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: string | number | null | undefined, currency = "BRL"): string {
  if (!value || isNaN(Number(value))) return "R$ 0";
  
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function formatNumber(value: number | string | null | undefined): string {
  if (!value || isNaN(Number(value))) return "0";
  
  const num = Number(value);
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  
  return num.toString();
}

export function formatDate(date: Date | string | null | undefined, format: "short" | "long" = "short"): string {
  if (!date) return "Data não disponível";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return "Data inválida";
  
  if (format === "long") {
    return dateObj.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  
  return dateObj.toLocaleDateString("pt-BR");
}

export function formatTime(date: Date | string | null | undefined): string {
  if (!date) return "Hora não disponível";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return "Hora inválida";
  
  return dateObj.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");
  
  // Format based on length
  if (cleaned.length === 11) {
    // Mobile: (XX) 9XXXX-XXXX
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    // Landline: (XX) XXXX-XXXX
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone; // Return original if doesn't match expected patterns
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "??";
  
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return "";
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + "...";
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function isValidEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;
  
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 || cleaned.length === 11;
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function getFileExtension(filename: string | null | undefined): string {
  if (!filename) return "";
  
  const lastDot = filename.lastIndexOf(".");
  return lastDot > 0 ? filename.substring(lastDot + 1).toLowerCase() : "";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
