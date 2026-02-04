# PROFOLIO - Architecture & Features

## Overview
PROFOLIO is a professional-grade, drag-and-drop portfolio builder. It allows users to build, style, and publish personalized landing pages using a structured slot-based editor.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express.
- **Database**: PostgreSQL (NeonDB) with JSONB for flexible layout storage.
- **Authentication**: NextAuth.js (Credentials Provider).
- **Icons**: Lucide React.
- **Communication**: Axios with custom React hooks (`usePortfolio`, `useAuth`).

## Core Architecture

### 1. Data Flow & Storage
Unlike traditional builders that use fixed columns, Profolio uses a **JSONB architecture**. 
- The `portfolios` table has a `content` column of type `JSONB`.
- This stores a structured object: `{ header: [], body: [], footer: [] }`.
- Each element in these arrays is a **Component Object** containing `type`, `content`, and `styles`.
- This allows for infinite customization without requiring database schema changes when new components are added.

### 2. Structured Slot Editor
The editor uses a weight-driven, structured approach:
- **Sections**: Dedicated slots for Header, Body, and Footer to ensure logical page flow.
- **Drag-to-Add**: Users can drag elements (Text, Image, Button, Divider, Socials) from the sidebar directly into any section.
- **Live Preview**: An instant toggle to see the portfolio exactly as it will appear to the public.
- **Inline Styling**: Direct control over font sizes, colors, background colors, and border-radii via a settings interface.
- **Reordering**: Smooth, spring-animated reordering using `framer-motion`'s `Reorder` components.

### 3. Public Publishing Flow
- **Slugs**: Each portfolio has a unique, SEO-friendly URL slug.
- **Status Management**: Portfolios can be toggled between `draft` and `published`.
- **Public Route**: A specialized dynamic route at `/p/[slug]` renders the portfolio in a high-performance, read-only mode.
- **SEO**: Dynamic metadata (title, descriptions) is generated based on the portfolio content.

## Directory Structure

### Client (`/client`)
- `app/`: Next.js App Router routes.
  - `(auth)/`: Login and Sign-up pages.
  - `dashboard/`: User workspace and Portfolio Editor.
  - `p/[slug]/`: Public portfolio rendering.
- `hooks/`: Custom React hooks for API management (The only way to interact with the backend).
- `lib/`: Centralized API instances and utility functions.
- `components/`: UI components and providers.

### Server (`/server`)
- `src/controllers/`: Business logic for portfolios and auth.
- `src/routes/`: API endpoint definitions.
- `src/config/`: Database connection and initialization (`initDb.js` handles schema migrations).

## Development Rules
1. **API Interaction**: Always use the custom hooks (`usePortfolio`, `useAuth`). Direct `axios` calls in components are prohibited.
2. **Styling**: Stick to the curated HSL color palette and Glassmorphism principles defined in the design system.
3.  **Animations**: Use `framer-motion` for all transitions. Keep durations between 0.2s and 0.4s for a professional feel.