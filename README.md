# PinAffiliate AI - MVP

This is the Minimum Viable Product (MVP) for PinAffiliate AI, a web application designed to help users generate Pinterest-ready affiliate content using Amazon products.

## Features

- **Authentication**: Simple email/password authentication (auto-signup enabled for MVP testing).
- **Dashboard**: Overview of recent generations and account status.
- **Settings**: Save and manage your Amazon Affiliate tracking tag/store ID.
- **Generate**: AI-powered generation of Pinterest titles, descriptions, and keywords based on a given niche.
- **Results**: View generated content, copy it to clipboard, or export as CSV/JSON.
- **Multi-User Affiliate Support**: Users can safely generate their own affiliate links tied strictly to their account.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons
- **Backend**: Next.js Server Actions, NextAuth.js
- **Database**: Prisma ORM with SQLite (for easy local setup)
- **AI**: Google Gemini AI (with a built-in mock fallback)

## Setup Instructions

Follow these exact steps to run the application locally from a fresh clone. These steps work on Windows (via PowerShell/Command Prompt), macOS, and Linux.

### 1. Install Dependencies

```bash
npm install
```
*Note: This will also automatically run `prisma generate` to create the database client.*

### 2. Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```
*(On Windows Command Prompt, use `copy .env.example .env`)*

Ensure the following variables are present in your `.env` file:
- `NEXTAUTH_SECRET`: A secure random string. For local testing, you can use any random string like `your-secret-here`.
- `NEXTAUTH_URL`: Should be set to `http://localhost:3000`.
- `GEMINI_API_KEY`: (Optional) Your Google Gemini API key. If omitted, the app will use a mock AI generator with realistic sample data.

### 3. Setup Database

Initialize the SQLite database and run the migrations to create the necessary tables (including the User table required for login):

```bash
npm run setup
```
*(This command is a shortcut for `npx prisma migrate dev`)*

### 4. Run Development Server

```bash
npm run dev
```

### 5. Test the Login Flow

1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. The app uses auto-signup for the MVP. You can type *any* email and password into the login form.
3. If the account doesn't exist, it will be automatically created, and you will be logged in.

## Implementation Notes

- **Multi-User Affiliate Linking**:
  - Every logged-in user saves their own tracking ID in the `UserSettings` table.
  - Generating pins fetches the authenticated user's tag on the server-side, verifying that the user owns the tag.
  - The link builder strictly uses the authenticated user's tag and no global or hardcoded tags are utilized.
  - Validation ensures the user provides a structurally valid Amazon Affiliate tracking tag (e.g. `yourname-20`).
- **Authentication**: For the MVP, `NextAuth` is configured with a simple Credentials Provider. If an email doesn't exist, it will automatically create an account, making it easy to test.
- **Database**: The app uses an SQLite database (`dev.db`) for immediate out-of-the-box local usage without requiring external cloud databases like Supabase or Postgres setup.
- **Product Provider**: A modular `ProductProvider` service has been implemented. Currently, it defaults to a `MockProductProvider` which returns realistic sample Amazon products. The codebase is structured so this can be easily swapped for a real Amazon API provider later by updating `src/services/product-provider/index.ts`.
- **AI Generator**: The app includes a `GeminiAIGenerator`. If no `GEMINI_API_KEY` is provided in the `.env` file, it gracefully falls back to a `MockAIGenerator` that returns realistic Pinterest copy.
