# Local Lead Systems - Product Requirements Document

## Original Problem Statement
Build a high-performing, mobile-first one-page website for "Local Lead Systems". Target audience: Maryland-based outdoor service businesses (Deck Builders, Landscapers, Roofers, Fence Installers, etc.) who want to capture more jobs they usually miss to slow follow-up.

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI + MongoDB
- **Form Integration**: Formspree (requires FORMSPREE_FORM_ID in .env)
- **Admin Auth**: Simple username/password (MVP)

## User Personas
1. **Primary**: Maryland outdoor service contractors (deck builders, fence installers, landscapers, tree removal, painters, roofers)
2. **Admin**: Business owner viewing/managing leads

## Core Requirements (Static)
- Mobile-first responsive design with large tappable buttons
- Trust-based color palette (Navy #1B365D, Orange #FF6B00)
- "Contractor speak" not "marketing speak"
- Simple pricing: $500 setup + $150/month
- ROI-focused messaging (1 job = pays for itself)
- Local Maryland hooks (Montgomery, Howard, Frederick Counties)

## What's Been Implemented (Jan 2026)

### Landing Page Sections ✅
1. **Hero**: "Turn missed calls into booked jobs" + location badge + "Get a Free Website Check" CTA
2. **Problem ("Leaky Bucket")**: 4 pain points (missed calls, slow texts, outdated site, zero reviews)
3. **3-Step Solution**: Upgrade website → Capture leads → Track & win
4. **What You Get**: 5-item checklist (website, quote form, automation, tracking, reviews)
5. **Pricing**: $500 setup + $150/mo with ROI calculator (shows 1 job to break even)
6. **Industries**: 6 trade icons (Deck, Fence, Landscaping, Tree, Painting, Roofing)
7. **FAQ**: 3 direct questions (How long? Do I own it? Contract?)
8. **Lead Form**: "Request My Free Website Check"
9. **Footer**: Local Lead Systems + counties

### Backend ✅
- POST /api/leads - Create lead
- GET /api/leads - List leads with search
- DELETE /api/leads/{id} - Delete lead
- POST /api/admin/login - Admin authentication
- Formspree integration (requires form ID)

### Admin Dashboard ✅
- Login page
- Leads table with search
- Lead count display
- Delete functionality

## Prioritized Backlog

### P0 (Critical)
- [x] Form submission working
- [x] Admin can view leads
- [x] New pricing displayed correctly

### P1 (Important)
- [ ] Add Formspree form ID for email notifications
- [ ] Update admin credentials in production

### P2 (Nice to Have)
- [ ] Export leads to CSV
- [ ] Email notification on new lead
- [ ] Analytics/tracking integration

## Next Tasks
1. User to provide Formspree form ID and add to backend/.env
2. Update admin password for production
3. Consider adding Google Analytics for conversion tracking

## Admin Credentials
- Username: admin
- Password: groovemedia2024
