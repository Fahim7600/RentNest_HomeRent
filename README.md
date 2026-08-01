# RentNest — Home & Apartment Rental Platform

RentNest is a full-featured, modern Web application built with Next.js 15 for searching, listing, renting, and managing residential properties. It features role-based access control for Tenants, Landlords, and Admins, integrated Stripe payment processing, real-time optimistic state management, and moderation tools.

---

## 🔑 Seeded Demo Credentials

Use these pre-seeded backend accounts to test different roles:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@rentnest.com` | `Admin@123` | Platform oversight, User Moderation (Ban/Unban), Property & Application Audit, Category CRUD |
| **Landlord** | *Register or use seeded landlord* | *Your password* | Post & Edit Property Listings, Approve/Reject Tenant Requests |
| **Tenant** | *Register or use seeded tenant* | *Your password* | Browse Properties, Submit Rental Applications, Stripe Payment Checkout, Property Reviews |

---

## 🛠️ Tech Stack & Key Libraries

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Dark Mode Glassmorphism UI)
- **State Management & Caching**: [@tanstack/react-query v5](https://tanstack.com/query) & [Zustand](https://github.com/pmndrs/zustand)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation schemas
- **Icons & Feedback**: [Lucide React](https://lucide.dev/) & [Sonner](https://sonner.emilkowal.si/) toasts
- **Auth & Cookies**: JWT Auth stored via `js-cookie` and HTTP Route Guard Proxy (`proxy.ts`)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Fahim7600/RentNest_HomeRent.git
   cd RentNest_Forntend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Verify TypeScript & Production Build:**
   ```bash
   npx tsc --noEmit
   npx eslint .
   npx next build
   ```

---

## 🖼️ Property Images & Seed Data Note

- **Image URL Handling**: When creating or editing properties as a Landlord, please provide valid full HTTP/HTTPS image URLs (e.g. from Unsplash, Imgur, or Cloudinary).
- **Backend Seed Filenames**: The backend database contains legacy seeded properties with bare filenames (e.g. `"Exterior.jpg"`). To prevent Next.js `next/image` runtime crashes, RentNest uses `formatImageUrl` (`lib/image.ts`), which automatically falls back to curated high-resolution interior/exterior Unsplash placeholders whenever a non-URL image string is encountered.

---

## 📑 API Integration Mapping

For detailed route-by-route API mappings, HTTP methods, authorization roles, and response envelope conventions, see [API_INTEGRATION.md](./API_INTEGRATION.md).
