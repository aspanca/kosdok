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

- **Next.js 15** (App Router) with **React 19** and **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix UI primitives)
- **TanStack Query** — data fetching
- **Lucide React** — icons
- **Yarn 4** — package manager
- **Vercel** — deployment

## Getting Started

```bash
cd client
yarn install
yarn dev
```

The dev server starts at `http://localhost:3000`. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` to your API base URL.

## Build & Deploy

```bash
cd client
yarn build
```

Deployment is configured for Vercel (the `client/` directory is the project root).

## Project Structure

```
kosdok/
├── client/
│   ├── src/
│   │   ├── app/           # Next.js App Router routes + root layout
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context (auth)
│   │   ├── lib/           # API client, utilities, theme
│   │   ├── views/         # Page components rendered by app/ routes
│   │   └── i18n/          # Albanian translations
│   ├── package.json
│   ├── next.config.mjs
│   └── tailwind.config.js
└── README.md
```
