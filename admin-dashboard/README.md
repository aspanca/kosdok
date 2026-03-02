# Kosdok Admin Dashboard

Admin panel for managing Kosdok platform data.

## Default credentials

- **Email:** admin@kosdok.com
- **Password:** admin123

## Development

```bash
npm install
npm run dev
```

Runs at http://localhost:5174

## Build

```bash
npm run build
```

## Features

- **Cities** – Register and manage cities
- **Services** – Register and manage medical services
- **Facilities** – Register and manage amenities (parking, wifi, etc.)
- **Patients** – View and suspend patient accounts
- **Clinics** – View and suspend clinic accounts
- **Labs** – View and suspend lab accounts
- **Pharmacies** – View and suspend pharmacy accounts
- **Doctors** – View and suspend doctor accounts

## API

Uses the same server as the main client. Set `VITE_API_URL` (default: http://localhost:4000/api) for the API base URL.
