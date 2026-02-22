# Kosdok — Healthcare Directory for Kosovo

Kosdok is a healthcare directory platform that helps users in Kosovo find doctors, hospitals, clinics, and pharmacies. It also provides blood donation event listings, appointment booking, and a review system — all in Albanian.

## Features

**Search & Discovery**
- Browse healthcare providers by category (Doktoret, Spitalet, Klinikat, Barnatoret)
- Basic and advanced search with filters
- Provider detail pages with services, hours, location, and reviews

**Appointments & Reviews**
- Book appointments with doctors and clinics
- Leave and manage reviews for healthcare providers

**Blood Donation**
- Blood donation information and event listings

**Clinic Dashboard**
- Separate clinic portal for managing clinic info, services, staff, schedule, and amenities

**Blog & Content**
- Blog with healthcare-related articles
- Contact and privacy policy pages

## Tech Stack

- **React 18** with **TypeScript**
- **Vite** — build tool and dev server
- **TanStack Router** — file-based routing
- **Tailwind CSS** + **shadcn/ui** (Radix UI primitives)
- **Lucide React** — icons
- **Sentry** — error tracking
- **Yarn 4** — package manager
- **Netlify** — deployment

## Getting Started

```bash
cd client
yarn install
yarn dev
```

The dev server starts at `http://localhost:5173`.

## Build & Deploy

```bash
cd client
yarn build
```

Deployment is configured for Netlify. See `client/netlify.toml` for settings.

## Project Structure

```
kosdok/
├── client/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context (auth)
│   │   ├── lib/           # Utilities and theme
│   │   ├── pages/         # Page components
│   │   ├── routes/        # TanStack Router route definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── scripts/           # Deployment scripts
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── netlify.toml
└── README.md
```
