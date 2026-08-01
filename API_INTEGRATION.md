# RentNest — API Integration Mapping

This document provides a comprehensive mapping of every frontend page and component in `rentnest-frontend` to its corresponding backend API endpoint(s), HTTP methods, authorization role requirements, and expected data shapes.

---

## Response Envelope & Data Conventions

The backend API follows a standard JSON response envelope structure:

```ts
// Success Envelope
{
  "success": true,
  "message": "Operation description",
  "data": { ... } // or array
}

// Error Envelope
{
  "success": false,
  "message": "Error details message",
  "errorDetails": { ... }
}
```

### Critical Data Shape & Key Naming Notice
All paginated list endpoints return their items array under explicit entity-specific key names (unwrapped from `data` by `apiFetch` in `lib/api-client.ts`):

- `GET /properties`, `GET /landlord/properties`, `GET /admin/properties`
  `data: { meta: { total, page, limit, totalPages }, properties: Property[] }`
- `GET /rentals`, `GET /landlord/requests`, `GET /admin/rentals`
  `data: { meta: { total, page, limit, totalPages }, rentals: RentalRequest[] }`
- `GET /payments`, `GET /admin/payments`
  `data: { meta: { total, page, limit, totalPages }, payments: Payment[] }`
- `GET /admin/users`
  `data: { meta: { total, page, limit, totalPages }, users: User[] }`
- `GET /categories`
  `data: Category[]` (or array directly)
- `GET /rentals/:id`
  `data: RentalRequest` (single object, unwrapped)

---

## 1. Public Pages (`app/(public)/`)

| Route / Component | Endpoint | Method | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `app/(public)/page.tsx` | `GET /properties` | `GET` | `PUBLIC` | Fetches featured property listings for hero/grid view. |
| `app/(public)/properties/page.tsx` | `GET /properties` | `GET` | `PUBLIC` | Full paginated browsing grid driven by location, price, category, and pagination query params. |
| `app/(public)/properties/_components/property-filters.tsx` | `GET /categories` | `GET` | `PUBLIC` | Populates category dropdown choices for property filtering. |
| `app/(public)/properties/[id]/page.tsx` | `GET /properties/:id`<br/>`GET /properties/:id/reviews` | `GET`<br/>`GET` | `PUBLIC` | Fetches detailed property specifications, landlord info, and tenant review comments. |

---

## 2. Authentication Pages (`app/(auth)/`)

| Route / Component | Endpoint | Method | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `app/(auth)/login/_components/login-form.tsx` | `POST /auth/login` | `POST` | `PUBLIC` | Authenticates email & password, returns JWT token and user profile object. |
| `app/(auth)/register/_components/register-form.tsx` | `POST /auth/register` | `POST` | `PUBLIC` | Registers a new account with role selection (`TENANT` or `LANDLORD`). |

---

## 3. Tenant Dashboard (`app/dashboard/tenant/`)

| Route / Component | Endpoint | Method | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `app/dashboard/tenant/page.tsx` | `GET /rentals`<br/>`GET /payments` | `GET`<br/>`GET` | `TENANT` | Lists tenant's active rental applications and past payment history. |
| `app/(public)/properties/[id]/_components/request-modal.tsx` | `POST /rentals` | `POST` | `TENANT` | Submits a new rental application (`propertyId`, `startDate`, `duration`). |
| `app/dashboard/tenant/_components/review-modal.tsx` | `POST /properties/:id/reviews` | `POST` | `TENANT` | Submits a review and rating score for an occupied rental property. |

---

## 4. Payment Flow (`app/dashboard/tenant/requests/[id]/pay/` & `app/payment/`)

| Route / Component | Endpoint | Method | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `app/dashboard/tenant/requests/[id]/pay/page.tsx` | `GET /rentals/:id`<br/>`POST /payments/create` | `GET`<br/>`POST` | `TENANT` | Fetches rental request details and creates a Stripe checkout session (`sessionId`, `url`). |
| `app/payment/success/page.tsx` | `GET /payments` | `GET` | `TENANT` | Verifies payment completion upon returning from Stripe Checkout. |
| `app/payment/cancel/page.tsx` | N/A | N/A | `TENANT` | Friendly payment cancellation landing page. |

---

## 5. Landlord Dashboard (`app/dashboard/landlord/`)

| Route / Component | Endpoint | Method | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `app/dashboard/landlord/page.tsx` | `GET /landlord/properties`<br/>`GET /landlord/requests` | `GET`<br/>`GET` | `LANDLORD` | Overview metrics (total listings, pending requests, active leases). |
| `app/dashboard/landlord/properties/page.tsx` | `GET /landlord/properties`<br/>`DELETE /landlord/properties/:id` | `GET`<br/>`DELETE` | `LANDLORD` | Lists landlord's property portfolio and handles property removal. |
| `app/dashboard/landlord/properties/new/page.tsx` | `POST /landlord/properties`<br/>`GET /categories` | `POST`<br/>`GET` | `LANDLORD` | Form to publish a new property listing with category selection. |
| `app/dashboard/landlord/properties/[id]/edit/page.tsx` | `GET /properties/:id`<br/>`PUT /landlord/properties/:id` | `GET`<br/>`PUT` | `LANDLORD` | Form to update existing property specifications. |
| `app/dashboard/landlord/requests/page.tsx` | `GET /landlord/requests`<br/>`PATCH /landlord/requests/:id` | `GET`<br/>`PATCH` | `LANDLORD` | Incoming rental applications with optimistic approval/rejection (`action: "APPROVE" \| "REJECT"`). |

---

## 6. Admin Dashboard (`app/dashboard/admin/`)

| Route / Component | Endpoint | Method | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `app/dashboard/admin/page.tsx` | `GET /admin/users`<br/>`GET /admin/properties`<br/>`GET /admin/rentals`<br/>`GET /admin/payments` | `GET`<br/>`GET`<br/>`GET`<br/>`GET` | `ADMIN` | System overview dashboard displaying platform-wide statistics. |
| `app/dashboard/admin/users/page.tsx` | `GET /admin/users`<br/>`PATCH /admin/users/:id` | `GET`<br/>`PATCH` | `ADMIN` | User account moderation table with role/status filters and Ban/Unban toggle (`status: "ACTIVE" \| "BANNED"`). |
| `app/dashboard/admin/properties/page.tsx` | `GET /admin/properties` | `GET` | `ADMIN` | Read-only audit view of all properties published on the platform. |
| `app/dashboard/admin/requests/page.tsx` | `GET /admin/rentals` | `GET` | `ADMIN` | Read-only audit view of all tenant rental applications. |
| `app/dashboard/admin/categories/page.tsx` | `GET /categories`<br/>`POST /admin/categories`<br/>`PUT /admin/categories/:id`<br/>`DELETE /admin/categories/:id` | `GET`<br/>`POST`<br/>`PUT`<br/>`DELETE` | `ADMIN` | Full CRUD management for property categories. |
| `app/dashboard/admin/payments/page.tsx` | `GET /admin/payments` | `GET` | `ADMIN` | Read-only audit trail of financial payment transactions. |
