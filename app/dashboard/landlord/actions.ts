import { apiFetch, ApiError } from "@/lib/api-client";
import type { Property, RentalRequest } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface PropertyFilters {
  page?: number;
  limit?: number;
}

export interface LandlordRequestFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export interface PropertyPayload {
  title: string;
  description: string;
  location: string;
  price: number;
  propertyType: string;
  categoryId: string;
  amenities: string[];
  images: string[];
  availability?: "AVAILABLE" | "RENTED" | "MAINTENANCE";
}

interface LandlordPropertiesResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  properties: Property[];
}

interface LandlordRequestsResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  rentals: RentalRequest[];
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

/**
 * Fetch properties owned by the logged-in landlord.
 * Endpoint: GET /landlord/properties
 * Response shape: { meta, properties }
 */
export async function fetchLandlordProperties(filters?: PropertyFilters): Promise<{
  properties: Property[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const searchParams = new URLSearchParams();
  if (filters?.page) searchParams.append("page", String(filters.page));
  if (filters?.limit) searchParams.append("limit", String(filters.limit));

  const query = searchParams.toString();
  const endpoint = `/landlord/properties${query ? `?${query}` : ""}`;

  try {
    const data = await apiFetch<LandlordPropertiesResponse>(endpoint);
    const properties = (data.properties || []).map((p) => ({
      ...p,
      rentAmount: p.price ?? p.rentAmount ?? 0,
      isAvailable: p.availability ? p.availability === "AVAILABLE" : (p.isAvailable ?? true),
    }));

    return {
      properties,
      meta: data.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new Error("Failed to fetch landlord properties");
  }
}

/**
 * Create a new property.
 * Endpoint: POST /landlord/properties
 */
export async function createProperty(payload: PropertyPayload): Promise<Property> {
  return await apiFetch<Property>("/landlord/properties", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update an existing property by ID.
 * Endpoint: PUT /landlord/properties/:id
 */
export async function updateProperty(
  id: string,
  payload: Partial<PropertyPayload>
): Promise<Property> {
  return await apiFetch<Property>(`/landlord/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a property by ID.
 * Endpoint: DELETE /landlord/properties/:id
 */
export async function deleteProperty(id: string): Promise<void> {
  await apiFetch<void>(`/landlord/properties/${id}`, {
    method: "DELETE",
  });
}

/**
 * Fetch rental requests for landlord's properties.
 * Endpoint: GET /landlord/requests
 * Response shape: { meta, rentals }
 */
export async function fetchLandlordRequests(filters?: LandlordRequestFilters): Promise<{
  rentals: RentalRequest[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const searchParams = new URLSearchParams();
  if (filters?.status) searchParams.append("status", filters.status);
  if (filters?.page) searchParams.append("page", String(filters.page));
  if (filters?.limit) searchParams.append("limit", String(filters.limit));

  const query = searchParams.toString();
  const endpoint = `/landlord/requests${query ? `?${query}` : ""}`;

  try {
    const data = await apiFetch<LandlordRequestsResponse>(endpoint);
    return {
      rentals: data.rentals || [],
      meta: data.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new Error("Failed to fetch landlord requests");
  }
}

/**
 * Process a rental request (Approve / Reject).
 * Endpoint: PATCH /landlord/requests/:id
 * Body: { action: "APPROVE" | "REJECT" }
 */
export async function processRequest(
  id: string,
  action: "APPROVE" | "REJECT"
): Promise<RentalRequest> {
  return await apiFetch<RentalRequest>(`/landlord/requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ action }),
  });
}
