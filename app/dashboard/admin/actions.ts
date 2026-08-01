import { apiFetch, apiFetchFull, ApiError } from "@/lib/api-client";
import type { User, Property, RentalRequest, Payment, Category } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface UserFilters {
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface AdminPropertyFilters {
  availability?: string;
  landlordId?: string;
  page?: number;
  limit?: number;
}

export interface AdminRentalFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export interface AdminPaymentFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export interface CategoryPayload {
  name: string;
  description?: string;
}

interface AdminUsersResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  users: User[];
}

interface AdminPropertiesResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  properties: Property[];
}

interface AdminRentalsResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  rentals: RentalRequest[];
}

interface AdminPaymentsResponse {
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
 * Fetch platform users for admin management.
 * Endpoint: GET /admin/users
 * Query: role, status, page, limit
 * Response shape: { meta, users }
 */
export async function fetchUsers(filters?: UserFilters): Promise<{
  users: User[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const searchParams = new URLSearchParams();
  if (filters?.role) searchParams.append("role", filters.role);
  if (filters?.status) searchParams.append("status", filters.status);
  if (filters?.page) searchParams.append("page", String(filters.page));
  if (filters?.limit) searchParams.append("limit", String(filters.limit));

  const query = searchParams.toString();
  const endpoint = `/admin/users${query ? `?${query}` : ""}`;

  try {
    const data = await apiFetch<AdminUsersResponse>(endpoint);
    return {
      users: data.users || [],
      meta: data.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new Error("Failed to fetch users");
  }
}

/**
 * Update user account status (Ban / Unban).
 * Endpoint: PATCH /admin/users/:id
 * Body: { status: "ACTIVE" | "BANNED" }
 */
export async function updateUserStatus(
  id: string,
  status: "ACTIVE" | "BANNED"
): Promise<{ user: User; message: string }> {
  const res = await apiFetchFull<User>(`/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return { user: res.data, message: res.message };
}

/**
 * Fetch all platform properties for admin oversight.
 * Endpoint: GET /admin/properties
 * Response shape: { meta, properties }
 */
export async function fetchAdminProperties(filters?: AdminPropertyFilters): Promise<{
  properties: Property[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const searchParams = new URLSearchParams();
  if (filters?.availability) searchParams.append("availability", filters.availability);
  if (filters?.landlordId) searchParams.append("landlordId", filters.landlordId);
  if (filters?.page) searchParams.append("page", String(filters.page));
  if (filters?.limit) searchParams.append("limit", String(filters.limit));

  const query = searchParams.toString();
  const endpoint = `/admin/properties${query ? `?${query}` : ""}`;

  try {
    const data = await apiFetch<AdminPropertiesResponse>(endpoint);
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
    throw new Error("Failed to fetch properties");
  }
}

/**
 * Fetch all rental applications across the platform.
 * Endpoint: GET /admin/rentals
 * Response shape: { meta, rentals }
 */
export async function fetchAdminRentals(filters?: AdminRentalFilters): Promise<{
  rentals: RentalRequest[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const searchParams = new URLSearchParams();
  if (filters?.status) searchParams.append("status", filters.status);
  if (filters?.page) searchParams.append("page", String(filters.page));
  if (filters?.limit) searchParams.append("limit", String(filters.limit));

  const query = searchParams.toString();
  const endpoint = `/admin/rentals${query ? `?${query}` : ""}`;

  try {
    const data = await apiFetch<AdminRentalsResponse>(endpoint);
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
 * Fetch all payments across the platform for admin oversight.
 * Endpoint: GET /admin/payments
 * Response shape: { meta, payments }
 */
export async function fetchAdminPayments(filters?: AdminPaymentFilters): Promise<{
  payments: Payment[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const searchParams = new URLSearchParams();
  if (filters?.status) searchParams.append("status", filters.status);
  if (filters?.page) searchParams.append("page", String(filters.page));
  if (filters?.limit) searchParams.append("limit", String(filters.limit));

  const query = searchParams.toString();
  const endpoint = `/admin/payments${query ? `?${query}` : ""}`;

  try {
    const data = await apiFetch<AdminPaymentsResponse>(endpoint);
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
 * Create a new category (Admin only).
 * Endpoint: POST /admin/categories
 */
export async function createCategory(payload: CategoryPayload): Promise<Category> {
  return await apiFetch<Category>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update an existing category (Admin only).
 * Endpoint: PUT /admin/categories/:id
 */
export async function updateCategory(
  id: string,
  payload: CategoryPayload
): Promise<Category> {
  return await apiFetch<Category>(`/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a category by ID (Admin only).
 * Endpoint: DELETE /admin/categories/:id
 */
export async function deleteCategory(id: string): Promise<void> {
  await apiFetch<void>(`/admin/categories/${id}`, {
    method: "DELETE",
  });
}
