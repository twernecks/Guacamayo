import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

// Server Component on purpose: `metadata` can only be exported from a Server
// Component, so the interactive session/guard logic lives in the Client
// Component `AdminShell` this renders instead (research.md Decision 6).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
