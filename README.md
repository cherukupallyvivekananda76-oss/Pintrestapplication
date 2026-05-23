# PinAffiliate AI - MVP

This is the Minimum Viable Product (MVP) for PinAffiliate AI, a web application designed to help users generate Pinterest-ready affiliate content using Amazon products.

## Features

- **Authentication**: Simple email/password authentication (auto-signup enabled for MVP testing).
- **Dashboard**: Overview of recent generations and account status.
- **Settings**: Save and manage your Amazon Affiliate tracking tag/store ID.
- **Generate**: AI-powered generation of Pinterest titles, descriptions, and keywords based on a given niche.
- **Results**: View generated content, copy it to clipboard, or export as CSV/JSON.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons
- **Backend**: Next.js Server Actions, NextAuth.js
- **Database**: Prisma ORM with SQLite (for easy local setup)
- **AI**: Google Gemini AI (with a built-in mock fallback)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Set the necessary environment variables in `.env`:
- `NEXTAUTH_SECRET`: A secure random string (you can generate one with `openssl rand -base64 32`)
- `GEMINI_API_KEY`: (Optional) Your Google Gemini API key. If omitted, the app will use a mock AI generator with realistic sample data.

### 3. Setup Database

Initialize the SQLite database and run the schema push:

```bash
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Implementation Notes

- **Authentication**: For the MVP, `NextAuth` is configured with a simple Credentials Provider. If an email doesn't exist, it will automatically create an account, making it easy to test.
- **Database**: The app uses an SQLite database (`dev.db`) for immediate out-of-the-box local usage without requiring external cloud databases like Supabase or Postgres setup.
- **Product Provider**: A modular `ProductProvider` service has been implemented. Currently, it defaults to a `MockProductProvider` which returns realistic sample Amazon products. The codebase is structured so this can be easily swapped for a real Amazon API provider later by updating `src/services/product-provider/index.ts`.
- **AI Generator**: The app includes a `GeminiAIGenerator`. If no `GEMINI_API_KEY` is provided in the `.env` file, it gracefully falls back to a `MockAIGenerator` that returns realistic Pinterest copy.
- **Affiliate Links**: The affiliate link builder (`src/utils/affiliate.ts`) is fully functional. It takes the user's saved tag from settings and correctly attaches it to the generated product links.
