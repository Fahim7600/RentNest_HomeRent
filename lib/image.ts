const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";

/**
 * Ensures any image URL passed to Next.js <Image /> is valid.
 * Handles HTTP/HTTPS URLs, leading slash relative paths, and provides
 * a clean Unsplash fallback for invalid or dummy strings (e.g. "Exterior.jpg").
 */
export function formatImageUrl(src?: string): string {
  if (!src || typeof src !== "string") return FALLBACK_IMAGE;

  const trimmed = src.trim();

  // Absolute URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Valid relative path (e.g. /images/hero.jpg)
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // Unqualified string like "Exterior.jpg" -> fallback to placeholder
  return FALLBACK_IMAGE;
}
