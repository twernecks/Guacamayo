import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminSession } from "@/domain/admin/auth";

const mockAuthStore = vi.hoisted(() => ({
  getSession: vi.fn(),
  setSession: vi.fn(),
  clearSession: vi.fn(),
}));

vi.mock("@/domain/admin/auth-store", () => ({
  authStore: mockAuthStore,
}));

vi.mock("@/services/admin/auth-service", () => ({
  refresh: vi.fn(),
}));

import { refresh } from "@/services/admin/auth-service";
import { request } from "@/services/admin/api-client";
import { ConflictError } from "@/domain/admin/shared";

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const SESSION: AdminSession = {
  accessToken: "access-token",
  accessTokenExpiresAt: new Date(Date.now() + 60_000).toISOString(),
  refreshToken: "refresh-token",
  displayName: "Admin",
};

beforeEach(() => {
  mockAuthStore.getSession.mockReset().mockReturnValue(SESSION);
  mockAuthStore.setSession.mockReset();
  mockAuthStore.clearSession.mockReset();
  vi.mocked(refresh).mockReset();
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("request", () => {
  it("returns data and sends the current access token on a successful envelope", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse(200, { isSuccess: true, data: { id: "1" }, error: null }),
    );

    const result = await request<{ id: string }>("/api/admin/rooms/1");

    expect(result).toEqual({ id: "1" });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5249/api/admin/rooms/1",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer access-token" }),
      }),
    );
  });

  it("throws an ApiError with field details on a 422 validation error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse(422, {
        isSuccess: false,
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "One or more fields are invalid.",
          details: [{ field: "name.pt", message: "Name (pt) is required." }],
        },
      }),
    );

    await expect(request("/api/admin/rooms", "POST", {})).rejects.toMatchObject({
      name: "ApiError",
      code: "VALIDATION_ERROR",
      details: [{ field: "name.pt", message: "Name (pt) is required." }],
    });
  });

  it("throws a distinct ConflictError on a 409, never a generic ApiError", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse(409, {
        isSuccess: false,
        data: null,
        error: {
          code: "CONCURRENT_MODIFICATION",
          message: "O item foi alterado por outra pessoa.",
          details: null,
        },
      }),
    );

    await expect(request("/api/admin/rooms/1", "PUT", {})).rejects.toBeInstanceOf(ConflictError);
  });

  it("refreshes once and retries the original request after a 401", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(jsonResponse(200, { isSuccess: true, data: { id: "1" }, error: null }));
    const renewed: AdminSession = { ...SESSION, accessToken: "renewed-token" };
    vi.mocked(refresh).mockResolvedValue(renewed);

    const result = await request<{ id: string }>("/api/admin/rooms/1");

    expect(refresh).toHaveBeenCalledWith("refresh-token");
    expect(mockAuthStore.setSession).toHaveBeenCalledWith(renewed);
    expect(result).toEqual({ id: "1" });
    expect(vi.mocked(fetch).mock.calls[1]?.[1]).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer renewed-token" }),
      }),
    );
  });

  it("clears the session and throws when refresh also fails after a 401", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 401 }));
    vi.mocked(refresh).mockRejectedValue(new Error("invalid refresh token"));

    await expect(request("/api/admin/rooms/1")).rejects.toMatchObject({
      name: "ApiError",
      code: "UNAUTHORIZED",
    });
    expect(mockAuthStore.clearSession).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("throws a NETWORK_ERROR ApiError when the server can't be reached", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError("fetch failed"));

    await expect(request("/api/admin/rooms")).rejects.toMatchObject({
      name: "ApiError",
      code: "NETWORK_ERROR",
    });
  });
});
