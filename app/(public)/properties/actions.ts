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

function normalizeProperty(raw: Property): Property {
  return {
    ...raw,
    rentAmount: raw.price ?? raw.rentAmount ?? 0,
    isAvailable:
      raw.availability !== undefined
        ? raw.availability === "AVAILABLE"
        : (raw.isAvailable ?? true),
    bedrooms: raw.bedrooms ?? 1,
  };
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

    let rawList: Property[] = [];
    let metaPage = Number(params?.page) || 1;
    let metaLimit = Number(params?.limit) || 10;
    let metaTotal = 0;
    let metaTotalPages = 1;

    if (Array.isArray(rawData)) {
      rawList = rawData;
      metaTotal = rawData.length;
    } else if (rawData) {
      rawList = rawData.properties || rawData.data || rawData.result || [];
      if (rawData.meta) {
        metaPage = rawData.meta.page ?? metaPage;
        metaLimit = rawData.meta.limit ?? metaLimit;
        metaTotal = rawData.meta.total ?? rawList.length;
        metaTotalPages = (rawData.meta.totalPages ?? rawData.meta.totalPage ?? Math.ceil(metaTotal / metaLimit)) || 1;
      } else {
        metaTotal = rawList.length;
      }
    }

    const properties = rawList.map(normalizeProperty);

    return {
      properties,
      meta: {
        page: metaPage,
        limit: metaLimit,
        total: metaTotal,
        totalPage: metaTotalPages,
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
    const raw = await apiFetch<Property>(`/properties/${id}`);
    return raw ? normalizeProperty(raw) : null;
  } catch (err) {
    console.error(`Failed to fetch property ${id}:`, err);
    return null;
  }
}

export async function fetchPropertyReviews(id: string): Promise<Review[]> {
  try {
    const rawData = await apiFetch<
      PaginatedResult<Review> | Review[] | { reviews?: Review[]; data?: Review[]; result?: Review[] }
    >(`/properties/${id}/reviews`);

    if (Array.isArray(rawData)) return rawData;
    if (rawData) {
      return rawData.reviews || rawData.data || rawData.result || [];
    }
    return [];
  } catch {
    return [];
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const rawData = await apiFetch<
      Category[] | { categories?: Category[]; data?: Category[] }
    >("/categories");

    if (Array.isArray(rawData)) return rawData;
    if (rawData) {
      return rawData.categories || rawData.data || [];
    }
    return [];
  } catch {
    return [];
  }
}
