# ProfessorTheriault.com Homepage Design

## Overview

A single-page static homepage for ProfessorTheriault.com — a personal educational website serving both as a student hub (access course materials) and a professional portfolio (showcase teaching, attract students/clients).

**Tech stack:** Single `index.html` with embedded CSS. No JavaScript, no external dependencies, no build tools.

## Page Structure

### Hero Section

- **Background:** Dark navy/slate with light text
- **Heading:** "Professor Theriault" (~2.5rem, bold)
- **Tagline:** e.g., *"Exploring ideas through philosophy, ethics, and the humanities"*
- **Intro text:** 2-3 welcoming sentences — professional but warm, positioning as educator and resource

### Card Grid

Directly below the hero on a lighter background (soft off-white or light gray).

**Layout:** CSS Grid
- Desktop (900px+): 3 columns
- Tablet (600-899px): 2 columns
- Mobile (<600px): 1 column

### Footer

Simple — copyright line, optional contact email/link.

## Cards

5 cards in a flat grid (no section headings):

| # | Title | Description | Badge | Link | Icon |
|---|-------|-------------|-------|------|------|
| 1 | Introduction to Philosophy | Brief course description | Coming Soon | `#` (placeholder) | Scroll/book |
| 2 | Introduction to Ethics | Brief course description | Coming Soon | `#` (placeholder) | Scales of justice |
| 3 | Introduction to Humanities | Brief course description | Coming Soon | `#` (placeholder) | Classical column |
| 4 | Philosophy Games | Brief description of the site | Explore | `https://philosophygames.online` | Game controller |
| 5 | GIMP 3.0 Courses | Brief description (client work) | In Development | `#` (placeholder) | Paintbrush |

### Card Anatomy

Each card contains (top to bottom):
1. **Icon** — Unicode symbol or simple inline SVG
2. **Title** — bold heading (~1.2rem)
3. **Description** — 1-2 sentences, slightly muted text color
4. **Status badge** — small pill-shaped label in the corner (teal background, white text)

The entire card is wrapped in an `<a>` tag, making it fully clickable.

### Card Hover Effect

On hover:
- Card lifts up: `transform: translateY(-6px)`
- Shadow deepens: larger, more diffuse `box-shadow`
- Border color transitions from subtle light gray to vivid teal/cyan
- Transition: `~0.3s ease` on all animated properties

## Color Palette

| Element | Color |
|---------|-------|
| Hero background | Deep navy/slate (#1a2332 range) |
| Hero text | White / near-white |
| Page background | Soft off-white / light gray (#f5f7fa range) |
| Card background | White |
| Card border (rest) | Light gray (#e0e0e0 range) |
| Card border (hover) | Teal/cyan (#0ea5e9 range) |
| Card shadow (rest) | Subtle, light |
| Card shadow (hover) | Deeper, more spread |
| Badge background | Teal (#0ea5e9 range) |
| Badge text | White |
| Body text | Dark gray (#333 range) |
| Muted text | Medium gray (#666 range) |

Unified palette — all cards share the same blue/teal scheme, differentiated by icons.

## Typography

System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

No external font files. Fast, native rendering on all platforms.

| Element | Size | Weight |
|---------|------|--------|
| Hero heading | ~2.5rem | Bold |
| Hero tagline | ~1.2rem | Normal/italic |
| Hero intro | ~1rem | Normal |
| Card title | ~1.2rem | Bold |
| Card description | ~1rem | Normal |
| Badge | ~0.75rem | Semi-bold |

## Responsive Behavior

- All sizing uses `rem` and responsive grid
- Hero text scales down on smaller screens via media queries
- Cards maintain consistent padding at all breakpoints
- Grid gap stays proportional

## Performance

- Zero external dependencies
- Single HTML file, all CSS inline in `<style>` block
- No JavaScript required
- Near-instant load on any connection
