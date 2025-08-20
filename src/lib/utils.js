import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const navLinks = {
  SUPER_ADMIN: [{ path: "/superadmin", name: "Dashboard" }],
  COMPANY: [{ path: "/company", name: "Dashboard" }],
  ADMIN: [{ path: "/admin", name: "Dashboard" }],
  EMPLOYEE: [{ path: "/employee", name: "Dashboard" }],
  STUDENT: [{ path: "/student", name: "Dashboard" }],
  RECRUITER: [{ path: "/recruiter", name: "Dashboard" }],
};

export const formatStageLabel = (stage) =>
  stage
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const role = localStorage.getItem("role");
export const token = localStorage.getItem("token");
