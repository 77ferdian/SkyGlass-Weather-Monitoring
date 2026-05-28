---
name: Atmospheric Glass
colors:
  surface: '#0c1322'
  surface-dim: '#0c1322'
  surface-bright: '#323949'
  surface-container-lowest: '#070e1d'
  surface-container-low: '#141b2b'
  surface-container: '#191f2f'
  surface-container-high: '#232a3a'
  surface-container-highest: '#2e3545'
  on-surface: '#dce2f7'
  on-surface-variant: '#c3c6d6'
  inverse-surface: '#dce2f7'
  inverse-on-surface: '#293040'
  outline: '#8d909f'
  outline-variant: '#424654'
  surface-tint: '#b2c5ff'
  primary: '#b2c5ff'
  on-primary: '#002c72'
  primary-container: '#0155ce'
  on-primary-container: '#c9d6ff'
  inverse-primary: '#0556cf'
  secondary: '#ffb5a0'
  on-secondary: '#601400'
  secondary-container: '#852406'
  on-secondary-container: '#ff9b7f'
  tertiary: '#ffb59a'
  on-tertiary: '#5b1b00'
  tertiary-container: '#a63800'
  on-tertiary-container: '#ffcbb9'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001847'
  on-primary-fixed-variant: '#0040a0'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb5a0'
  on-secondary-fixed: '#3b0900'
  on-secondary-fixed-variant: '#852406'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#802900'
  background: '#0c1322'
  on-background: '#dce2f7'
  surface-variant: '#2e3545'
  clear-day-start: '#FFF7ED'
  clear-day-end: '#FED7AA'
  clear-night-start: '#0F172A'
  clear-night-end: '#1E293B'
  cloudy-silver: '#CBD5E1'
  storm-blue: '#1E3A5F'
  ice-blue: '#EFF6FF'
  glass-light: rgba(255, 255, 255, 0.12)
  glass-dark: rgba(0, 0, 0, 0.25)
typography:
  display-temp:
    fontFamily: outfit
    fontSize: 96px
    fontWeight: '800'
    lineHeight: 100px
    letterSpacing: -0.04em
  display-temp-mobile:
    fontFamily: outfit
    fontSize: 72px
    fontWeight: '800'
    lineHeight: 80px
    letterSpacing: -0.04em
  headline-city:
    fontFamily: outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-city-mobile:
    fontFamily: outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-uppercase:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding-mobile: 20px
  container-padding-desktop: 40px
  gutter: 16px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is centered on a **Dynamic Glassmorphic** aesthetic, designed to evoke the immediate sensation of the weather outside through high-fidelity visual metaphors. The target audience seeks a premium, data-rich experience that feels more like an immersive dashboard than a utility tool.

The style leverages **Glassmorphism** to create a sense of depth and hierarchy. By using frosted glass surfaces, the UI mimics a physical pane of glass looking out onto the world. The interface responds to environmental conditions using color shifts and translucency, making the app feel alive and context-aware. The primary design movement is **Modern Minimalism**, where whitespace is replaced by "blur-space," ensuring that even with high data density, the interface remains breathable and sophisticated.

## Colors

The color palette of this design system is dynamic and situational. While the core brand utilizes a deep **Royal Blue** (`#0155CE`) for interactive elements and a vibrant **Sunset Orange** (`#EB6E4B`) for highlights, the background and surface colors shift based on the meteorological state.

The system defaults to a **Dark Mode** foundation to maximize the "glow" effect of data visualizations and glass containers. 

- **Clear Skies:** Utilize warm ambers and golden hues for day, transitioning to deep navy gradients for night.
- **Atmospheric Conditions:** Cloudy states use silver-grey and slate; precipitation states use high-contrast storm blues and deep indigos.
- **Glass Surfaces:** Two distinct glass treatments exist. A light glass (`rgba(255, 255, 255, 0.12)`) for highlighting data containers, and a dark glass (`rgba(0, 0, 0, 0.25)`) for secondary background elements.

## Typography

This design system uses a dual-font strategy to balance character and clarity. **Outfit** is the display typeface, chosen for its geometric purity and modern edge, making it ideal for the massive temperature readings and city names. **Inter** handles all functional body text and labels to ensure maximum legibility against complex glass backgrounds.

Typography is treated as a visual layer. Temperatures use an extra-bold weight (`800`) to anchor the screen, while labels use a medium weight (`500` or `600`) with increased letter spacing when in uppercase to maintain readability over blurred textures. Large display types should utilize negative letter-spacing to feel more cohesive and architectural.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a focus on vertical stack modules. The content should feel "suspended" within the glass panes. 

- **Desktop:** A 12-column system with wide 40px margins to emphasize the premium nature of the app.
- **Mobile:** A single-column layout where cards span the full width of the safe area. 
- **Rhythm:** Spacing follows an 8px base unit. Tight relationships (e.g., a label and its data point) use 8px or 12px, while distinct sections (e.g., Current Weather vs. Hourly Forecast) use 48px to create clear visual separation without the need for heavy dividers.

## Elevation & Depth

In this design system, elevation is not represented by traditional shadows, but by **Backdrop Blur** and **Tonal Layering**.

- **Surface Level 1 (Background):** A rich, dynamic gradient representing the current sky state.
- **Surface Level 2 (Cards):** Standard glass containers with a `20px` backdrop-filter blur and a `1px` semi-transparent border (top and left only) to simulate a light catch on the glass edge.
- **Surface Level 3 (Overlays/Modals):** A darker glass treatment with a `40px` blur to deeply obscure the background, creating a focused interaction space.

Soft, ambient glows in the primary brand color can be used behind cards to signify "active" states or high-priority weather alerts.

## Shapes

The shape language is sophisticated and modern, characterized by a mix of "Soft" and "Pill" geometries. 

- **Cards and Containers:** Use a `16px` radius (`rounded-lg`) to create a friendly but structural look.
- **Inputs and Interactive Toggles:** Use a `50px` full-pill radius. This distinct contrast between the structural cards and the organic interactive elements helps users intuitively understand where they can touch or type.
- **Dividers:** When necessary, dividers should be `1px` high with a gradient fade-out to avoid breaking the glass illusion.

## Components

### Buttons
Primary buttons should be styled as high-saturation glass or solid brand blue with a slight inner glow. Secondary buttons use the light glass treatment with a subtle white border. All buttons should have a `50px` radius.

### Cards
Cards are the primary organizational unit. They must feature a `20px` backdrop blur. Data within cards should be aligned to a strict internal grid to maintain order amidst the translucent backgrounds.

### Inputs (Search)
The search bar is a prominent pill-shaped element. It should use the `glass-dark` background to distinguish itself from the information cards.

### Chips/Badges
Used for weather alerts or status indicators (e.g., "High UV"). These are small, pill-shaped elements with high-contrast backgrounds (e.g., Brand Orange for warnings).

### Weather Icons (Meteocons)
Icons should be multi-colored and slightly animated where possible, sitting "inside" the glass containers. They should use a mix of flat and soft-gradient styles to match the modern aesthetic.

### Hourly/Daily Lists
Lists should be presented as horizontal scrolling rows within a card or a vertical list with subtle glass dividers. Each list item should have a hover/active state that increases the brightness of the glass background.