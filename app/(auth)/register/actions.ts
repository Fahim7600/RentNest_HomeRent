"use client";

import { apiFetch, ApiError } from "@/lib/api-client";
import { setToken, setUser } from "@/lib/auth";
import type { User } from "@/lib/types";
import type { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "TENANT" | "LANDLORD";
}

interface FieldError {
  field: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Register action
// ---------------------------------------------------------------------------
export async function registerAction(
  payload: RegisterPayload,
  setError: UseFormSetError<RegisterPayload>
): Promise<string | null> {
  try {
    const data = await apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // Store token & lightweight user in cookies
    setToken(data.token);
    setUser({ id: data.user.id, role: data.user.role, name: data.user.name });

    toast.success(`Welcome to RentNest, ${data.user.name}!`);

    // Return the redirect path based on role
    const role = data.user.role.toLowerCase();
    return `/dashboard/${role}`;
  } catch (err) {
    if (err instanceof ApiError) {
      // Map field-level errors to react-hook-form
      if (Array.isArray(err.errorDetails)) {
        (err.errorDetails as FieldError[]).forEach(({ field, message }) => {
          if (
            field === "name" ||
            field === "email" ||
            field === "password" ||
            field === "phone" ||
            field === "role"
          ) {
            setError(field, { message });
          }
        });
      }
      toast.error(err.message);
    } else {
      toast.error("Something went wrong. Please try again.");
    }
    return null;
  }
}
