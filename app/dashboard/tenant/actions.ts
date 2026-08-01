import { apiFetch, ApiError } from "@/lib/api-client";
import type { RentalRequest, Payment, Review } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface RentalFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaymentFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export interface SubmitRentalPayload {
  propertyId: string;
  startDate: string; // ISO datetime string
  duration: number;
}

export interface SubmitReviewPayload {
  rentalRequestId: string;
  rating: number; // 1-5
  comment: string;
}

interface RentalResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  rentals: RentalRequest[];
}

interface PaymentResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  payments: Payment[];
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

/**
 * Fetch rental requests for the logged-in tenant.
 * Response shape: { meta, rentals }
 */
export async function fetchTenantRentals(filters?: RentalFilters): Promise<{
  rentals: RentalRequest[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const searchParams = new URLSearchParams();
  if (filters?.status) searchParams.append("status", filters.status);
  if (filters?.page) searchParams.append("page", String(filters.page));
  if (filters?.limit) searchParams.append("limit", String(filters.limit));

  const query = searchParams.toString();
  const endpoint = `/rentals${query ? `?${query}` : ""}`;

  try {
    const data = await apiFetch<RentalResponse>(endpoint);
    return {
      rentals: data.rentals || [],
      meta: data.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new Error("Failed to fetch rental requests");
  }
}

/**
 * Fetch a single rental request by ID.
 * Response shape: single RentalRequest object directly (unwrapped by apiFetch).
 */
export async function fetchRentalRequestById(id: string): Promise<RentalRequest | null> {
  try {
    return await apiFetch<RentalRequest>(`/rentals/${id}`);
  } catch (err) {
    console.error(`Failed to fetch rental request ${id}:`, err);
    if (err instanceof ApiError) throw err;
    return null;
  }
}

/**
 * Fetch payments history for the logged-in tenant.
 * Response shape: { meta, payments }
 */
export async function fetchTenantPayments(filters?: PaymentFilters): Promise<{
  payments: Payment[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const searchParams = new URLSearchParams();
  if (filters?.status) searchParams.append("status", filters.status);
  if (filters?.page) searchParams.append("page", String(filters.page));
  if (filters?.limit) searchParams.append("limit", String(filters.limit));

  const query = searchParams.toString();
  const endpoint = `/payments${query ? `?${query}` : ""}`;

  try {
    const data = await apiFetch<PaymentResponse>(endpoint);
    return {
      payments: data.payments || [],
      meta: data.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new Error("Failed to fetch payment history");
  }
}

/**
 * Submit a new rental request.
 * Endpoint: POST /rentals
 * Body: { propertyId, startDate, duration }
 */
export async function submitRentalRequest(
  payload: SubmitRentalPayload
): Promise<RentalRequest> {
  return await apiFetch<RentalRequest>("/rentals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Initiate Stripe checkout session for an APPROVED rental request.
 * Endpoint: POST /payments/create
 * Body: { rentalRequestId }
 * Response shape (unwrapped): { sessionId: string, url: string | null }
 */
export async function createPaymentSession(
  rentalRequestId: string
): Promise<{ sessionId: string; url: string | null }> {
  return await apiFetch<{ sessionId: string; url: string | null }>(
    "/payments/create",
    {
      method: "POST",
      body: JSON.stringify({ rentalRequestId }),
    }
  );
}

/**
 * Submit a review for a completed rental.
 * Endpoint: POST /reviews
 * Body: { rentalRequestId, rating, comment }
 */
export async function submitReview(
  payload: SubmitReviewPayload
): Promise<Review> {
  return await apiFetch<Review>("/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
