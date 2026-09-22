# SeedBridge

A farmer-to-buyer digital marketplace platform for smallholder vegetable farmers in Ghana's Eastern Region, connecting farmers, buyers (including Market Queens), and logistics drivers.

## Run & Operate

- `pnpm --filter @workspace/seedbridge run dev` — run the frontend (served at `/`, default port 5173)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env (`artifacts/seedbridge/.env`): `VITE_API_URL` — base URL of the real backend (e.g. `http://localhost:7004`)

There is no self-hosted API server or database in this repo. The backend is a separate Express/MongoDB
project (`FullBackendd-master`), which this app's frontend talks to entirely through `VITE_API_URL`. Its
SeedBridge routes live under `/api/v1/seedbridge/*` there — auth (phone+password, its own `SeedBridgeUser`
collection, isolated from that backend's other apps), produce, orders, dashboard, USSD, and Paystack payment
(including webhook support). An earlier, unfinished self-hosted `api-server` + Postgres/Drizzle stack
(`artifacts/api-server`, `lib/db`) was scaffolded but never built out beyond a `/healthz` stub, and has been
removed — this app was pivoted to the external backend instead.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, wouter (routing), TanStack Query
- Backend: external Express/MongoDB project (`FullBackendd-master`, not part of this repo), reached via `VITE_API_URL`
- Validation: Zod (`zod/v4`)
- API codegen: Orval (from OpenAPI spec)

## Where things live

- `artifacts/seedbridge/src/pages/` — all page components (Landing, Marketplace, FarmerDashboard, BuyerDashboard, DriverDashboard, OrderList, OrderDetail, ProduceDetail, FarmerListings, NewListing, FreshRescue, PreHarvest)
- `artifacts/seedbridge/src/contexts/AuthContext.tsx` — auth state, token persistence, MoMo escrow token getter
- `artifacts/seedbridge/src/components/ui/` — shadcn-style UI components (button, card, tabs, badge, input, label, skeleton, select)
- `artifacts/seedbridge/src/lib/utils.ts` — `cn()`, crop emojis/labels, currency/weight formatters
- `artifacts/seedbridge/src/hooks/use-payment.js` — hand-written Paystack checkout calls (not generated; payment endpoints aren't in the OpenAPI spec yet)
- `lib/api-spec/openapi.yaml` — single source of truth for all frontend API contracts; `servers.url` points at `/api/v1/seedbridge` on the external backend
- `lib/api-client-react/src/generated/` — generated React Query hooks (from codegen)
- `lib/api-zod/src/generated/` — generated Zod schemas
- `FullBackendd-master/routes/seedbridge*.js`, `controllers/seedbridge*.js`, `models/SeedBridge*.js` — the actual backend implementation, in the separate `FullBackendd-master` repo

## Architecture decisions

- **OpenAPI-first**: All API contracts live in `lib/api-spec/openapi.yaml`. Frontend uses generated hooks only — never hand-written fetch calls.
- **`@workspace/api-client-react/custom-fetch`** is exported as a subpath to allow auth token injection via `setAuthTokenGetter()` in the AuthContext.
- **Auth is phone-first** (Ghana mobile) with localStorage token persistence and MoMo escrow flow.
- **Custom Tabs component** (not Radix-based) — uses `active` prop on `TabsTrigger` instead of `value` on `Tabs`.
- **`cn()` is exported from both `@/lib/utils` AND `@/components/ui/button`** — components in `ui/` may import from either.

## Product

- **Landing page** — showcases 5 innovations: Pre-Harvest Matching, Milk-Run logistics, Fresh Rescue pricing, MoMo Escrow, Market Queen Agent dashboard
- **Marketplace** — filterable produce grid with Fresh Harvest / Pre-Harvest / Fresh Rescue tabs
- **Fresh Rescue** (`/marketplace/fresh-rescue`) — urgent discount listings with countdown timers
- **Pre-Harvest** (`/marketplace/pre-harvest`) — deposit-based listings before harvest
- **Produce Detail** (`/produce/:id`) — full listing with order form and MoMo escrow CTA
- **Farmer Dashboard** — MoMo balance, listings, revenue chart, upcoming pickups
- **Buyer Dashboard** — active orders, spending, Fresh Rescue alerts
- **Driver Dashboard** — Milk-Run routes, backhaul slots, earnings
- **Orders** (`/orders`, `/orders/:id`) — unified order management with status timeline
- **Role-based registration** — Farmer / Buyer / Driver / Agent

## User preferences

_Populate as you build._

## Gotchas

- After any OpenAPI spec change, run `pnpm --filter @workspace/api-spec run codegen` before touching the frontend.
- The custom Tabs component does NOT accept a `value` prop on `<Tabs>` — use `active` prop on `<TabsTrigger>` instead.
- Hook options for queries require `queryKey` when passing a `query` option block: `{ query: { enabled: !!id, queryKey: getGetXQueryKey(id) } }`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
