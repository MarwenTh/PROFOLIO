# PROFOLIO - App Explanation

## Overview
PROFOLIO is a dynamic portfolio builder application designed to empower users to create stunning, personalized portfolios with ease. Users can join the platform, choose from a variety of professionally designed templates, and customize them to showcase their work, skills, and achievements.

## Core Features

### 1. User Authentication
- **Sign Up / Login:** Secure authentication system for users to create accounts and manage their portfolios.
- **Dashboard:** A personalized area where users can view their created portfolios, analytics (optional), and account settings.

### 2. Portfolio Builder
- **Template Selection:** Users can browse and select from a diverse range of templates (e.g., Minimalist, Creative, Corporate, Developer).
- **Drag-and-Drop Editor:** (Potential feature) An intuitive interface to rearrange sections, add new blocks (Text, Image, Video, Projects).
- **Customization:**
    - **Themes:** Change color schemes, fonts, and layout styles.
    - **Content Management:** Easy forms to input projects, work history, skills, and contact info.

### 3. Public Portfolio Generation
- **Unique URL:** Each user gets a unique URL (e.g., `profolio.com/username`) or custom domain support.
- **SEO Optimization:** Portfolios are optimized for search engines.
- **Responsive Design:** All portfolios look great on mobile, tablet, and desktop.

## Architecture Guidelines
- **Frontend:** Next.js (React) for a fast, SEO-friendly, and interactive user experience.
- **Styling:** Tailwind CSS for rapid, responsive styling.
- **Animation:** Framer Motion for smooth transitions and engaging interactions.
- **Icons:** Lucide React for modern, consistent iconography.

## Landing Page Strategy
The landing page serves as the main entry point to convert visitors into users.
- **Hero Section:** High-impact visual with a clear value proposition and specific Call-to-Action (CTA).
- **Features Breakdown:** visually appealing grid or list highlighting the key benefits.
- **Template Showcase:** A specialized section showing off the beautiful templates available.
- **Testimonials/Social Proof:** (Optional but recommended) To build trust.
- **Final CTA:** A strong reminder to get started for free.


### API Interaction
To ensure stability, code reusability, and easier maintenance in production, all calls to server endpoints **must** be implemented using **custom React hooks**.

- **Rule**: Do not call `api` or `axios` directly inside components.
- **Location**: Define hooks in `src/hooks/` (e.g., `useAuth.ts`).
- **Configuration**: Use the centralized Axios instance in `src/lib/api.ts`.