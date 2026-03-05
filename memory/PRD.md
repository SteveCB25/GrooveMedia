# Groove Media - Product Requirements Document

## Original Problem Statement
Build a high-performing, mobile-first one-page website for "Local Lead Systems" branded as "Groove Media". Target audience: Busy home service contractors (Roofers, Landscapers, Painters) in Maryland suburbs (Montgomery, Howard, and Frederick Counties).

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI + MongoDB
- **Form Integration**: Formspree (configured, requires FORMSPREE_FORM_ID in .env)
- **Admin Auth**: Simple username/password (MVP)

## User Personas
1. **Primary**: Maryland home service contractors (roofers, landscapers, painters, HVAC, plumbers)
2. **Admin**: Business owner viewing/managing leads

## Core Requirements (Static)
- Mobile-first responsive design
- Trust-based color palette (Navy #1B365D, Orange #FF6B00)
- Live status indicator with pulse animation
- Lead capture form with validation
- Admin dashboard for lead management
- Smooth scroll navigation
- Local Maryland hooks (Bethesda, Rockville, Ellicott City)

## What's Been Implemented (Jan 2026)
### Landing Page Sections ✅
- [x] Sticky header with navigation
- [x] Hero section with live status indicator
- [x] Problem section (3 cards)
- [x] How It Works section (3 steps)
- [x] What You Get section (Website + Automation)
- [x] Pricing section (Starter $1,500, Growth $2,500, Pro $3,500)
- [x] Proof/Results section with metrics
- [x] FAQ accordion (6 questions)
- [x] Lead form with validation
- [x] Footer with Maryland branding

### Backend ✅
- [x] POST /api/leads - Create lead
- [x] GET /api/leads - List leads with search
- [x] DELETE /api/leads/{id} - Delete lead
- [x] POST /api/admin/login - Admin authentication
- [x] Formspree integration (requires form ID)

### Admin Dashboard ✅
- [x] Login page
- [x] Leads table with search
- [x] Lead count display
- [x] Delete functionality

## Prioritized Backlog
### P0 (Critical)
- [x] Form submission working
- [x] Admin can view leads

### P1 (Important)
- [ ] Add Formspree form ID for email notifications
- [ ] Update admin credentials in production
- [ ] Add real testimonials

### P2 (Nice to Have)
- [ ] Export leads to CSV
- [ ] Email notification on new lead
- [ ] Analytics/tracking integration
- [ ] A/B testing capability

## Next Tasks
1. User to provide Formspree form ID and add to backend/.env
2. Replace placeholder testimonials with real contractor quotes
3. Update admin password for production
4. Consider adding Google Analytics
