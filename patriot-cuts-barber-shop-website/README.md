# Patriot Cuts Barber Shop — Static Business Website

A mobile-first, multi-page business website built with **HTML5, CSS3 and vanilla JavaScript only**.

## Pages
- `index.html` — Home
- `about.html` — About
- `services.html` — Services
- `gallery.html` — Gallery + lightbox
- `reviews.html` — Reviews/testimonials
- `faq.html` — FAQ accordion
- `contact.html` — Contact form + Google Map
- `privacy.html` / `terms.html` — simple launch placeholders

## Reusing the site
Start with `js/config.js`. That is the main client-editing file. Change:
- Business name/tagline/description
- Brand colors
- Logo path
- Phone/email/address
- WhatsApp/social links
- Google Maps URL
- Opening hours
- Gallery image URLs/paths

The shared `js/main.js` populates repeated business details across the pages and builds the Google Maps embed from the configured address.

## Images
The gallery includes the Google Maps photo supplied in the project brief. The other gallery images are deliberately branded placeholders. Replace their `src` values in `js/config.js` with approved client photos.

## Contact form
The form includes client-side validation and a success state, but it does not send email because no backend/form provider was supplied. Connect it to the client's chosen form service before production.

## Running locally
You can open `index.html` directly in a modern browser. For the most reliable local development experience, use any simple static file server. No npm install or build step is required.

## Content note
No fake awards, certifications, ratings, statistics, prices, or testimonials are presented as real. Where the brief did not provide verified information, the site uses explicit placeholders or asks the visitor to confirm with the shop.
