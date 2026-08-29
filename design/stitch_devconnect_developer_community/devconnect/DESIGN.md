---
name: DevConnect
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#474651'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#777682'
  outline-variant: '#c8c5d3'
  surface-tint: '#5654a8'
  primary: '#1a146b'
  on-primary: '#ffffff'
  primary-container: '#312e81'
  on-primary-container: '#9c9af4'
  inverse-primary: '#c3c0ff'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#002931'
  on-tertiary: '#ffffff'
  tertiary-container: '#00404c'
  on-tertiary-container: '#00b3d1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#100563'
  on-primary-fixed-variant: '#3e3c8f'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  nav-bg: '#1E1B4B'
  border-subtle: '#E2E8F0'
  text-main: '#0F172A'
  text-muted: '#64748B'
  status-success: '#10B981'
  status-warning: '#F59E0B'
  status-error: '#EF4444'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  code-snippet:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
  max-width: 1440px
---

## Brand & Style

The design system is engineered for a professional technology community, emphasizing technical competence, trust, and clarity. It balances the utility of a developer tool with the engagement of a collaborative social platform.

The aesthetic follows a **Corporate / Modern** direction with a focus on high information density and functional elegance. It avoids "social media clutter" by utilizing a structured 8px grid and a "light-first" interface that feels crisp and academic. The visual language is defined by sharp utility, subtle depth, and intentional use of color to signal status and action without overwhelming the user.

Key characteristics:
- **Professionalism:** High-quality typography and consistent alignment.
- **Functionality:** UI components optimized for technical metadata and code-friendly layouts.
- **Collaborative:** Clear pathways for interaction (Member role) and oversight (Administrator role).
- **Technical:** Use of monospaced accents to appeal to the developer persona.

## Colors

The palette is anchored by **Deep Navy** for structural elements like navigation, providing a grounded, authoritative frame. **Indigo** serves as the primary action color, chosen for its accessibility and professional association. **Cyan** acts as a surgical accent for highlighting active states or specific technical tags.

### Functional Color Usage
- **Primary (Indigo):** Buttons, links, and active selection states.
- **Secondary (Navy):** Top navigation and sidebar headers to establish hierarchy.
- **Accents (Cyan):** Restrained use for "New" indicators, tech tags, and secondary highlights.
- **System States:** Standard traffic-light logic (Green/Success, Amber/Warning, Red/Destructive). Note: Red is strictly reserved for high-risk moderation or permanent deletion to prevent "alert fatigue."
- **Neutrals:** Cool-greys are used for backgrounds and borders to maintain a "technical" atmosphere rather than a warm, domestic one.

## Typography

This design system uses a dual-font approach. **Inter** handles all primary communication, providing exceptional readability and a neutral, modern tone. **JetBrains Mono** is introduced as a functional secondary font for technical metadata, tags, and snippets, signaling to the user that the information is data-driven or code-related.

- **Headlines:** Use tighter letter spacing and semi-bold weights to create a strong visual anchor.
- **Body:** Standardized at 16px for optimal long-form reading in discussions.
- **Monospaced Accents:** Used exclusively for tags (e.g., `[v1.0.4]`, `[C#]`), timestamps, and system logs.
- **Mobile Scaling:** Headlines scale down on mobile to prevent awkward line breaks while maintaining semantic hierarchy.

## Layout & Spacing

The layout is built on an **8px grid system**, ensuring all components align to a predictable rhythm. 

- **Desktop (1440px):** A three-column fluid grid.
  - *Left Sidebar (280px):* Navigation and user shortcuts.
  - *Center Feed (720px max):* Primary content, optimized for reading line length.
  - *Right Sidebar (320px):* Contextual discovery and metadata (Announcements, Events).
- **Tablet (768px):** The three-column layout collapses. Sidebars move into a hidden drawer or bottom navigation. The center feed expands to fill the width minus 24px margins.
- **Mobile (390px):** Single-column layout. Touch targets are strictly maintained at a minimum of 44x44px. 

Horizontal scrolling is forbidden except for clearly indicated overflow patterns like a tag cloud or tab list.

## Elevation & Depth

This design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. Depth is communicated through surface color shifts (e.g., a slightly darker grey for the background and pure white for cards).

- **Surface Level 0 (Background):** `neutral-color` (#F8FAFC).
- **Surface Level 1 (Cards/Composers):** White (#FFFFFF) with a `1px` border in `border-subtle` (#E2E8F0).
- **Surface Level 2 (Modals/Dropdowns):** White with a subtle ambient shadow (0px 4px 12px rgba(0, 0, 0, 0.05)) to separate the element from the main content plane.
- **Transitions:** State changes (hover/active) are communicated via background color shifts or border color changes (Indigo) rather than increasing shadow depth, keeping the UI feeling "flat" and fast.

## Shapes

The shape language is consistently **Rounded**, using a 10px to 14px radius range to soften the technical nature of the content without appearing juvenile.

- **Small Components (Buttons/Inputs):** 8px (rounded-md) for a precise, clickable feel.
- **Medium Components (Cards/Modals):** 12px (rounded-lg) to provide a distinct frame for content.
- **Large Components (Banners/Sections):** 14px (rounded-xl) for broad layout containers.
- **Avatar/Status:** Full circles (rounded-full) are used for user profile images to distinguish "people" from "objects" (which are always rectangular).

## Components

### Buttons
- **Primary:** Solid Indigo background, white text. 8px radius.
- **Secondary:** Transparent background, Indigo border and text.
- **Destructive:** Solid Red background (Admin only, requires confirmation).
- **Ghost:** No border or background, Indigo or Grey text. Used for low-priority actions in a PostCard footer.

### PostCard (Dynamic)
A white container with a 1px border.
- **Header:** Author avatar (32px), Display Name, Role Badge (Admin/Member), and Monospaced Timestamp.
- **Body:** Title (Title-MD), Excerpt (Body-MD), and Tech Tags (Monospaced, Cyan background).
- **Footer:** Action bar with Like, Comment, Save, and Share. Interaction icons must be 24px within a 44px hit area.

### Input Fields
- **Default:** 1px `border-subtle` with a subtle grey inner shadow. Focus state switches border to Indigo and adds a 2px outer glow in Indigo (20% opacity).
- **Validation:** Error states use `status-error` for both the border and a helper text message below the field.

### Moderation Elements (Admin Only)
- **Status Chips:** Small, monospaced labels (e.g., `[REPORTED]`, `[LOCKED]`) using Amber or Red text with 10% opacity backgrounds.
- **Inline Actions:** Small ghost buttons found in an overflow menu or header, clearly separated from engagement actions to prevent accidental clicks.

### Loading & Empty States
- **Skeletons:** Use a subtle pulse animation on `border-subtle` colored shapes that match the final content's geometry.
- **Empty States:** Center-aligned illustration (simplified technical icon) + Title-MD + "Create Post" or "Join Community" CTA.