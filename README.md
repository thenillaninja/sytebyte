# SyteByte

**The Websyte App.**

SyteByte is a local-first static website builder designed to create polished, multipage websites for small businesses.

It turns structured business information into a responsive website that can be previewed, customized, saved as an editable project, and published as deployable static files.

**Try it online:**  
https://thenillaninja.github.io/sytebyte/demo/

## What SyteByte Does

SyteByte combines a structured business-data workflow with a visual website builder.

Users can:

- Enter business details, contact information, services, hours, testimonials, FAQs, and service areas
- Choose between multiple site templates
- Customize colors, hero layouts, textures, motion, and imagery
- Upload logos, hero images, and gallery images
- Create and manage multipage websites
- Reorder, enable, disable, and customize page sections
- Configure navigation
- Link buttons, products, collections, and CTAs to pages, sections, or external URLs
- Preview the generated site while editing
- Save projects as `.sytebyte.json`
- Import saved projects later
- Publish the completed website as a ZIP of static HTML files

## Templates

Current starter templates include:

- Local Service
- Restaurant
- Professional
- Retail
- Automotive
- Blank

Additional page templates include:

- About
- Services
- Collection
- Gallery
- Contact
- Blank

## Local-First

SyteByte is intentionally designed to work locally.

The current version does not require:

- A CMS
- A database
- A JavaScript framework
- A hosted backend
- External business-data APIs

This keeps the core website-generation workflow portable and easy to understand.

## Technology

SyteByte is built with:

- HTML5
- CSS3
- Vanilla JavaScript
- Browser Blob APIs
- Client-side project serialization
- Client-side ZIP generation

No frontend framework is required.

## Project Files

Editable SyteByte projects can be saved as:

`.sytebyte.json`

These files preserve project structure, pages, site content, design settings, and supported uploaded imagery.

## Publishing

SyteByte publishes a complete multipage website ZIP.

The Home page becomes:

`index.html`

Additional pages are generated from their page slugs.

The resulting files can be uploaded to static hosting or a traditional web server.

## Status

SyteByte is under active development.

The core builder currently supports:

- Live preview
- Multipage architecture
- Page templates
- Section management
- Structured links
- Project save/import
- Static website publishing
- Built-in user guide

## Live Demo

Try SyteByte directly in your browser:

https://thenillaninja.github.io/sytebyte/demo/

## Project Page

https://thenillaninja.github.io/sytebyte/

## Repository

https://github.com/thenillaninja/sytebyte

## Portfolio

https://thenillaninja.github.io/mark-portfolio-v2/

---

© 2026 A NillaNinja Production
