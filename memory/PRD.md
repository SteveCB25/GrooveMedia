# Groove Media - Static Website PRD

## Original Problem Statement
Build a static, single-page website for "Groove Media" (formerly "Local Lead Systems") targeting home service contractors in the DMV area. The site promotes lead generation services with website + automation packages.

## Target Audience
Home service contractors: deck builders, fence installers, landscapers, tree removal, painters, roofers, flooring specialists, and general contractors.

## Core Requirements
1. **Static Site Only** - Plain HTML, CSS, vanilla JavaScript (no frameworks)
2. **Mobile-First Design** - Responsive across all devices
3. **Formspree Integration** - Contact form posts to `https://formspree.io/f/mgonwdye`
4. **Desktop Hero Image** - Visible on desktop, hidden on mobile
5. **Industry Jumplinks** - Trade cards link to contact form and pre-select service dropdown

## Design Guidelines Applied
| Element | Size | Weight |
|---------|------|--------|
| Main Headlines | 36-48px | Extra Bold (800) |
| Subheadlines | 20-24px | Regular (400) |
| Body Text | 18px | Regular (400) |
| Button Text | 18px | Bold (700) |
| Logo | 32-36px | Extra Bold (800) |
| Line Height | 1.5-1.6 | - |
| All-caps Labels | 13-14px | Letter-spacing 0.05em |

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Form Handler:** Formspree
- **Fonts:** Barlow Condensed (headings), Inter (body)
- **Color Scheme:** Navy (#1B365D), Orange (#FF6B00)

## File Structure
```
/app/static-site/
├── index.html     # All page content
├── styles.css     # All styling
├── script.js      # Client-side interactivity
└── assets/
    └── hero-contractors.jpg
```

## What's Been Implemented (December 2025)
- [x] Complete static site structure
- [x] Navy/orange color theme matching original React design
- [x] Mobile-first responsive design
- [x] Desktop-only hero image (hidden on mobile via CSS)
- [x] Industry cards as jumplinks to contact form
- [x] Form dropdown auto-selection when clicking industry links
- [x] Formspree form integration (endpoint: mgonwdye)
- [x] FAQ accordion
- [x] Mobile hamburger menu
- [x] Smooth scroll navigation
- [x] **Typography overhaul per user specs:**
  - Headlines 36-48px Extra Bold
  - Body text 18px
  - Buttons 18px Bold
  - Logo 36px
  - Proper line-height (1.5-1.6)
  - Letter-spacing on all-caps labels

## User Deployment
User will deploy via GitHub → Vercel. Static files are ready in `/app/static-site/`.

## Notes
- No backend required
- No database required
- Files are copied to `/app/frontend/public/` for Emergent preview only
