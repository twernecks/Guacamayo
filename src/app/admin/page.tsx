"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";

/**
 * Landing page right after login. Reached only once `status` is already
 * "authenticated" (the route guard in AdminShell redirects anyone else away
 * before this ever renders) — its only job is to send the admin to the
 * default section. `/admin/rooms` doesn't exist yet until User Story 2 is
 * implemented; until then this is simply the end of the User Story 1 flow.
 */
export default function AdminHomePage() {
  const { status } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin/rooms");
    }
  }, [status, router]);

  return null;
}
