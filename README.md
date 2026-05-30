# SmartBill AI - AI-Powered Smart Billing & Business Assistant SaaS

Production-style full-stack SaaS scaffold with React, Vite, Tailwind, Zustand, Framer Motion, Express, JWT, Socket.io, Prisma 6, PostgreSQL/Neon, and Cashfree UPI QR payments.

## What is included

- Premium dark SaaS landing page and authenticated dashboard
- Register, login, logout, JWT session persistence
- Admin, Manager, and Cashier role protection
- Product, inventory, low-stock, customer, invoice, payment, and analytics modules
- Cashfree Create Order plus Order Pay UPI `qrcode` flow
- Real Cashfree webhook signature verification using raw request body
- Server-side payment verification before marking invoices paid
- Duplicate webhook protection through transaction event IDs
- Socket.io instant invoice and dashboard updates after verified payment
- Prisma 6 schema with business relationships and payment records
- AI-ready folders and placeholder APIs

## Setup

1. Install dependencies.

```bash
npm install
npm run install:all
```

2. Configure backend environment.

```bash
cd server
copy .env.example .env
```

Set these values in `server/.env`:

- `DATABASE_URL`: Neon PostgreSQL connection string
- `JWT_SECRET`: long random secret
- `CASHFREE_CLIENT_ID`: Cashfree app ID
- `CASHFREE_CLIENT_SECRET`: Cashfree secret key
- `CASHFREE_ENV`: `sandbox` or `production`
- `CASHFREE_NOTIFY_URL`: public webhook URL ending in `/api/webhooks/cashfree`
- `CLIENT_URL`: usually `http://localhost:5173`

3. Configure frontend environment.

```bash
cd ../client
copy .env.example .env
```

4. Generate Prisma client and migrate Neon.

```bash
cd ../server
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
```

5. Run the platform.

```bash
cd ..
npm run dev
```

Open `http://localhost:5173`.

Demo login after seed:

- Email: `admin@smartbill.ai`
- Password: `Admin@12345`

## Cashfree local webhook testing

Cashfree must reach your local backend, so expose the server with a tunnel.

```bash
ngrok http 5000
```

Put this in `server/.env`:

```bash
CASHFREE_NOTIFY_URL=https://YOUR-NGROK-DOMAIN.ngrok-free.app/api/webhooks/cashfree
```

Restart the backend after changing `.env`.

In the Cashfree dashboard, enable payment webhooks for your sandbox account. The backend verifies `x-webhook-signature` and `x-webhook-timestamp`, verifies the payment server-side, stores the transaction, marks the invoice as `PAID`, and emits a Socket.io update.

## Important production notes

- Never mark invoices paid from the frontend. This project only marks paid inside the verified Cashfree webhook handler.
- Use Cashfree sandbox credentials while testing. Production credentials and production webhook URLs are required for live payments.
- Cashfree Order Pay UPI QR requires your Cashfree account to have the server-to-server payment flow enabled.
- Add a PDF rendering service or browser print pipeline before using PDF export in production at scale.
- Add background reconciliation jobs to periodically verify pending Cashfree orders.
