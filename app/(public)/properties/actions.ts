import { apiFetch } from "@/lib/api-client";
import type { Category, Property, Review, PaginatedResult } from "@/lib/types";

export interface PropertyQueryParams {
  location?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  propertyType?: string;
  categoryId?: string;
  page?: string | number;
  limit?: string | number;
}

export async function fetchProperties(params?: PropertyQueryParams): Promise<{
  properties: Property[];
  meta: { page: number; limit: number; total: number; totalPage: number };
}> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
  }

  const queryString = searchParams.toString();
  const endpoint = `/properties${queryString ? `?${queryString}` : ""}`;

  try {
    const rawData = await apiFetch<PaginatedResult<Property> | Property[]>(endpoint);

    if (Array.isArray(rawData)) {
      return {
        properties: rawData,
        meta: { page: 1, limit: rawData.length || 10, total: rawData.length, totalPage: 1 },
      };
    }

    const properties = rawData.data || rawData.result || [];
    const meta = rawData.meta || {
      page: Number(params?.page) || 1,
      limit: Number(params?.limit) || 10,
      total: properties.length,
      totalPage: 1,
    };

    return {
      properties,
      meta: {
        page: meta.page || 1,
        limit: meta.limit || 10,
        total: meta.total ?? properties.length,
        totalPage: meta.totalPage ?? Math.ceil((meta.total ?? properties.length) / (meta.limit || 10)) || 1,
      },
    };
  } catch (err) {
    console.error("Failed to fetch properties:", err);
    return {
      properties: [],
      meta: { page: 1, limit: 10, total: 0, totalPage: 1 },
    };
  }
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
    return await apiFetch<Property>(`/properties/${id}`);
  } catch (err) {
    console.error(`Failed to fetch property ${id}:`, err);
    return null;
  }
}

export async function fetchPropertyReviews(id: string): Promise<Review[]> {
  try {
    const data = await apiFetch<Review[] | { result?: Review[]; data?: Review[] }>(
      `/properties/${id}/reviews`
    );
    if (Array.isArray(data)) return data;
    return data.data || data.result || [];
  } catch {
    return [];
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await apiFetch<Category[] | { data?: Category[]; result?: Category[] }>(
      "/categories"
    );
    if (Array.isArray(data)) return data;
    return data.data || data.result || [];
  } catch {
    return [];
  }
}
