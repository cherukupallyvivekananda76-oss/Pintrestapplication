# PinAffiliate AI - Product Specification & Build Guide

## APP NAME
**PinAffiliate AI**

---

## CORE GOAL
Build a web app that helps users generate Pinterest-ready affiliate product content using REAL Amazon products.

This app does NOT directly post to Pinterest in v1.
Instead, the user selects a niche and the number of pins/products they want, and the app returns real Amazon products with:
1. product title
2. product image
3. product URL
4. affiliate link using the user's own affiliate tag / store ID
5. short Pinterest-friendly title
6. Pinterest-friendly description
7. optional keywords / hashtags

---

## CORE USER FLOW
1. User signs up / logs in
2. User opens dashboard
3. User saves their Amazon affiliate tracking ID / store ID in settings
4. User enters a niche keyword like "lamp", "study table", "desk organizer", "kitchen gadgets"
5. User selects number of products/pins to generate, for example 5
6. App fetches REAL Amazon products related to that niche
7. App attaches the user's affiliate tag/store ID to each product link
8. App generates Pinterest-ready product copy using AI
9. App shows results in a clean card/table layout
10. User can copy each result manually and use it to post on Pinterest

---

## IMPORTANT PRODUCT RULES
- V1 should NOT auto-post to Pinterest
- V1 should ONLY work with real Amazon products, not AI-generated fake items
- The app must be practical, functional, and clean, not animation-heavy
- Prioritize working functionality over fancy design
- If a product source/API is not available, create a clear abstraction layer / mock provider so the app can still run end-to-end with sample data and be swapped later
- Do not build fake affiliate logic; structure the code so affiliate links are created properly from the user's saved tracking/store ID
- Include affiliate disclosure support in the UI because Amazon affiliate disclosures should be clearly shown near links/content
- Keep the architecture modular so Pinterest posting can be added in v2
- If Amazon PA API 5.0 is outdated/deprecated for new builds, design the product-source layer so it can be replaced by Amazon Creators API or another approved Amazon product source later

---

## WHAT TO BUILD: Full-Stack MVP

A full-stack MVP with:
- Authentication
- Dashboard
- Settings page
- Generate pins/products page
- Results page
- Database integration
- AI content generation
- Product source service abstraction
- Affiliate link builder
- Copy/export utilities

---

## PREFERRED STACK
- **Frontend**: Next.js or React-based modern web app
- **Backend**: Node.js / server actions / API routes
- **Database**: Supabase or Firebase
- **Auth**: Supabase Auth, Firebase Auth, or equivalent
- **UI**: clean, minimal, mobile-responsive
- **AI**: Gemini for title/description generation
- **Deployment-ready structure**

---

## FEATURES TO IMPLEMENT

### 1. AUTHENTICATION
- Sign up
- Login
- Logout
- Protected dashboard routes

### 2. USER SETTINGS
- Save Amazon affiliate tracking ID / store ID
- Save default niche preferences if useful
- Save preferred output count
- Show a notice that users are responsible for affiliate program compliance

### 3. GENERATION FORM
**Fields:**
- Niche keyword
- Number of products/pins to generate
- Optional target audience
- Optional tone of description

### 4. PRODUCT FETCHING LAYER
Create a modular service called something like **ProductProvider**.

It should support:
- **Current provider**: mock/sample provider if live Amazon integration is not available
- **Future provider**: Amazon product API / Creators API / approved affiliate source

**Returned fields per product:**
- asin or unique product ID
- title
- image url
- product url
- price if available
- short features if available

### 5. AFFILIATE LINK BUILDER
Create a utility that takes:
- Base product URL
- User's affiliate tracking/store ID

And outputs the user-specific affiliate URL.

Make this logic modular and easy to replace depending on Amazon region/rules.

### 6. AI CONTENT GENERATION
For each product generate:
- Pinterest pin title
- Pinterest description
- 3–8 keywords or hashtags
- Short product summary

**Rules:**
- Content should be concise and Pinterest-friendly
- Avoid spammy claims
- Do not invent fake product features not present in the source data
- Tone should be natural and useful
- Content should help the user manually create or post a pin

### 7. RESULTS UI
Display generated results in cards and table form.

Each item should show:
- Product image
- Product title
- Niche
- Affiliate link
- Generated pin title
- Generated description
- Keywords
- Copy buttons for each field
- Open product link button

### 8. EXPORT / COPY TOOLS
- Copy affiliate link
- Copy full pin package
- Export results to CSV
- Export results to JSON

### 9. DISCLOSURE SUPPORT
Include a simple affiliate disclosure section or helper text.

Example style: "This may contain affiliate links / paid links."

Make this visible near exported content or results because affiliate disclosures should be clear and conspicuous.

### 10. ADMIN / DEBUG / DEV TOOLS
- Basic logs for generation requests
- Error handling
- Empty states
- Loading states
- Fallback states if product source fails

---

## NON-FUNCTIONAL REQUIREMENTS
- Clean codebase
- Modular folder structure
- Environment variable support
- .env.example file
- README with setup steps
- Responsive layout
- No unnecessary animations
- No broken pages
- Production-minded structure
- Strong error handling

---

## DESIGN REQUIREMENTS
- Simple, modern SaaS dashboard
- Focus on usability, not visual effects
- Minimal colors
- Professional layout
- Make it look real and trustworthy
- Dark mode optional but good to have

---

## PAGES/SCREENS
- Landing page
- Login/signup page
- Dashboard
- Generate page
- Results/history page
- Settings page

---

## DATABASE MODELS

### Suggested Data Model

**users**
- id
- email
- created_at

**user_settings**
- id
- user_id
- affiliate_tag
- default_niche
- default_pin_count
- created_at
- updated_at

**generation_jobs**
- id
- user_id
- niche
- pin_count
- audience
- tone
- status
- created_at

**generated_products**
- id
- job_id
- product_id
- product_title
- product_url
- affiliate_url
- image_url
- price
- features_json
- generated_pin_title
- generated_description
- keywords_json
- created_at

---

## TECHNICAL EXECUTION PLAN
1. First create the folder structure
2. Then create auth and database setup
3. Then create settings page and save affiliate tag
4. Then create generation form
5. Then create product provider service
6. Then create affiliate link builder
7. Then create AI generation pipeline
8. Then create results UI
9. Then create export tools
10. Then polish, test, and fix errors

---

## IF LIVE AMAZON INTEGRATION IS NOT POSSIBLE IMMEDIATELY
- Build the full app with a mock provider and clear interface boundaries
- Document exactly where the real Amazon integration should be inserted
- Keep the rest of the app fully functional

---

## IMPORTANT CONSTRAINTS
- Do not use fake placeholder logic everywhere
- Do not hardcode random fake products as the final solution
- If mocking is needed, clearly separate mock data from real integration layer
- Do not implement Pinterest posting in v1
- Do not overcomplicate with microservices
- Do not focus on unnecessary animation or branding polish before functionality

---

## EXPECTED OUTPUT
1. Build the app
2. Show folder structure
3. Show the main files created
4. Provide .env.example
5. Provide README with local setup and deployment steps
6. Clearly mark what is fully implemented vs mocked vs needs API keys
7. Make the app runnable end-to-end

---

## AFTER BUILDING
- Test the app flow
- Fix runtime errors
- Ensure the main flow works:
  - Save affiliate ID → Generate niche products → Build affiliate links → Generate Pinterest-ready descriptions → Display/export results

---

## BUILD PRIORITY
Build this as a serious MVP for a solo founder who wants a working app fast.

---

## Implementation Status
This document serves as the specification. Implementation will follow the technical execution plan above.
