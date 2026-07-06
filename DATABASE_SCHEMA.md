# Fresh Bites Database Model

## Collections

### `users`
- `name`: display name for admins and customers
- `email`: unique login identity
- `passwordHash`: bcrypt hash
- `phone`: optional contact number
- `role`: `admin` or `customer`
- `status`: `active` or `disabled`
- `lastLoginAt`: last successful login timestamp
- `createdAt`, `updatedAt`

### `menuitems`
- `name`: menu item title
- `category`: grouping used on the public menu
- `description`: customer-facing description
- `price`: numeric price in KES
- `status`: `available`, `featured`, `seasonal`, or `out-of-stock`
- `imageUrl`: uploaded asset path
- `createdAt`, `updatedAt`

### `bookings`
- `reference`: public booking reference like `FB-20260706-123`
- `clientName`, `email`, `phone`
- `eventType`
- `packageName`
- `eventDate`
- `location`
- `guestCount`
- `servingStyle`
- `paymentOption`
- `specialRequests`
- `status`: `pending`, `confirmed`, `completed`, or `cancelled`
- `notes`: admin-only internal note field
- `createdBy`: optional reference to `users`
- `createdAt`, `updatedAt`

### `payments`
- `booking`: optional reference to `bookings`
- `bookingReference`: denormalized lookup key used by the current frontend
- `customerName`, `phone`
- `amount`
- `method`: payment rail such as `M-Pesa`
- `status`: `pending`, `completed`, `failed`, or `refunded`
- `transactionId`
- `paidAt`
- `createdAt`, `updatedAt`

### `quotes`
- `clientName`, `email`, `phone`
- `eventType`
- `guestCount`
- `eventDate`
- `location`
- `budget`
- `notes`
- `status`: `review`, `quoted`, `accepted`, or `declined`
- `createdAt`, `updatedAt`

## Auth Model

- Authentication is JWT-based.
- `POST /api/auth/login` returns `{ token, id, name, email, role, phone, status, createdAt }`.
- Admin-only endpoints use `Authorization: Bearer <token>`.
- A bootstrap step creates the first admin user from `ADMIN_EMAIL` and `ADMIN_PASSWORD` if it does not already exist.

## Seed Strategy

- On startup, the backend seeds admin, menu items, bookings, payments, and a sample quote if the matching Mongo collections are empty.
- The seed source remains the existing JSON files under `backend/data/` so the current app data can be migrated forward instead of discarded.
