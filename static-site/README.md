# The Groove Media

A static landing page for contractor lead generation services in the DMV area.

## Quick Deploy to Vercel

1. Push this folder to GitHub
2. Import repo to [Vercel](https://vercel.com)
3. Deploy (no build settings needed - it's static HTML)

## Files

```
├── index.html          # Main page
├── styles.css          # All styles
├── script.js           # Interactivity
└── assets/
    └── hero-contractors.jpg
```

## Features

- Mobile-first responsive design
- Desktop-only hero image
- Industry jumplinks with form auto-select
- FAQ accordion
- Contact form via Formspree
- Smooth scroll navigation

## Form Setup

The contact form posts to Formspree. To use your own:

1. Create account at [formspree.io](https://formspree.io)
2. Replace the form action URL in `index.html`:
   ```html
   <form action="https://formspree.io/f/YOUR_ID" method="POST">
   ```

## Colors

- Navy: `#1B365D`
- Orange: `#FF6B00`

## Fonts

- Headings: Barlow Condensed
- Body: Inter

Both loaded via Google Fonts CDN.
