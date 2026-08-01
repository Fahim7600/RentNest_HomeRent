# 🏰 RentNest — Modern Rental Property Marketplace

RentNest is a high-performance, responsive Next.js 15 Web Application designed for browsing, listing, renting, and managing residential properties. Built with Next.js 15 App Router, TypeScript, Tailwind CSS v4, and React Query v5, RentNest provides tailored experiences for **Tenants**, **Landlords**, and **Admins**.

🌐 **Live Application**: [https://rent-nest-home-rent.vercel.app/](https://rent-nest-home-rent.vercel.app/)

---

## 🔑 Seeded Demo Credentials

Use these pre-seeded backend accounts to test role-based access control and dashboard features:

| Role | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@rentnest.com` | `Admin@123` | Moderate Users (Ban/Unban), Audit Properties & Rentals, Manage Categories, Track Platform Revenue |
| **Landlord** | *Register a Landlord account* | *Your password* | List & Edit Properties (with image URLs & availability toggles), Approve/Reject Tenant Requests |
| **Tenant** | *Register a Tenant account* | *Your password* | Search listings, Submit Rental Applications, Complete Stripe/SSLCommerz Payments, Submit Reviews |

---

## ✨ Key Features & Technical Highlights

### 🎨 Design & UI/UX Excellence
- **Floating Gradient Pill Navbar**: Custom blueish shading gradient with neon cyan hover glows and text-only uppercase monospace typography.
- **Unified Dark Mode Aesthetic**: Full-app dark slate theme (`#020617` / `bg-slate-950`) providing visual continuity across public, auth, and dashboard routes.
- **Responsive Layout**: Designed for mobile, tablet, and desktop with collapsible filter drawers and responsive data tables.

### 🏠 Property Marketplace & Availability Handling
- **Advanced Real-Time Filtering**: Debounced filter sidebar for location, price range, property type, and category.
- **Availability Overlays & Badges**: Automatic visual de-emphasis (`grayscale opacity-60`) and badges for `RENTED` and `MAINTENANCE` listings.
- **Disabled CTA Guard**: Prevents non-available properties from receiving rental requests regardless of auth state.
- **Optimized Media Loading**: Uses `next/image` with fallback handling (`lib/image.ts`) for legacy backend seed filenames.

### 💳 Payment & Rental Workflow
- **Role-Based Workflows**: Tenants request rentals -> Landlords Approve/Reject -> Approved requests unlock **"Pay Now"** checkout.
- **Payment Integration**: Seamless redirect to Stripe Checkout / SSLCommerz payment gateway.
- **Dedicated Outcome Pages**: [/payment/success](file:///e:/RentNest_Forntend/app/payment/success/page.tsx) and [/payment/cancel](file:///e:/RentNest_Forntend/app/payment/cancel/page.tsx) pages with instant status checks.

### 🛡️ Route Security & Error Resilience
- **HTTP Route Guard Proxy (`proxy.ts`)**: Automatically redirects unauthenticated users or unauthorized roles attempting to access protected `/dashboard/*` routes.
- **Global Error Boundaries**: Global `error.tsx`, custom `not-found.tsx` 404 page, and Sonner toast notifications for backend errors.
- **Universal Auth Resolver**: Automatically resolves JWT tokens across both browser Client Components and Next.js Server Components.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Fetching & State**: [@tanstack/react-query v5](https://tanstack.com/query) & [Zustand](https://github.com/pmndrs/zustand)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- **Notifications & Icons**: [Sonner](https://sonner.emilkowal.si/) & [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started & Deployment

- 🌐 **Live Production Link**: [https://rent-nest-home-rent.vercel.app/](https://rent-nest-home-rent.vercel.app/)

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Fahim7600/RentNest_HomeRent.git
   cd RentNest_Forntend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Copy `.env.local.example` to `.env.local` (optional):
   ```bash
   cp .env.local.example .env.local
   ```
   *Note: The app defaults to the production backend API at `https://assignment4-programminghero.onrender.com/api`.*

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run Verification Commands:**
   ```bash
   npx tsc --noEmit
   npx eslint .
   npx next build
   ```

---

## 📑 Documentation Links

- 📖 **API Integration Mapping**: See [API_INTEGRATION.md](./API_INTEGRATION.md) for detailed route-by-route backend endpoint mappings, HTTP methods, authorization rules, and envelope conventions.
