---
name: Quantum Precision
colors:
  surface: '#0e131e'
  surface-dim: '#0e131e'
  surface-bright: '#343945'
  surface-container-lowest: '#080e18'
  surface-container-low: '#161c26'
  surface-container: '#1a202a'
  surface-container-high: '#242a35'
  surface-container-highest: '#2f3540'
  on-surface: '#dde2f1'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dde2f1'
  inverse-on-surface: '#2b313c'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#89ceff'
  on-tertiary: '#00344d'
  tertiary-container: '#009ada'
  on-tertiary-container: '#002d43'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#0e131e'
  on-background: '#dde2f1'
  surface-variant: '#2f3540'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.1em
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
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style
The brand personality is high-fidelity, intellectual, and pioneering. It targets a sophisticated audience of quantum engineers, researchers, and enterprise stakeholders who demand clarity in complex data environments.

The design style is **Futuristic Minimalism** with a **Glassmorphic** layer. It borrows the structural discipline of Stripe with the material depth and motion-sensory refinement of Apple. The UI should feel like a premium physical device—cool to the touch, precisely machined, and illuminated from within. Visual interest is generated through light physics rather than decorative elements, utilizing background blurs, subtle glow effects, and ultra-fine borders to create a sense of infinite digital space.

## Colors
This design system utilizes a deep, immersive dark theme. The foundation is a "Void Navy" (#050a14), providing a canvas where light-based elements can pop with high contrast. 

- **Primary Electric Blue:** Used for primary actions, progress indicators, and active states. It represents the "pulse" of the network.
- **Accent Violet Glow:** Reserved for high-value data points, sophisticated status indicators, and subtle decorative gradients to signify "quantum states."
- **Surface & Borders:** Surfaces use a layered glass approach. Borders are never solid grey; they are semi-transparent white overlays that interact with the background colors.

## Typography
The typographic hierarchy emphasizes technical precision. 

- **Geist** is used for headlines to provide a sharp, modern, and slightly technical feel.
- **Inter** handles the heavy lifting for body text, ensuring maximum readability across varying screen densities.
- **JetBrains Mono** is introduced for metadata, code snippets, and system labels to reinforce the "Quantum Technology" narrative. 

All headings should use tighter letter spacing for a "locked-in" professional look, while mono-spaced labels should use slightly increased tracking to improve scanning.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. Content is contained within a 1440px max-width container, centered on the viewport. 

- **Grid:** A 12-column grid is used for desktop with 24px gutters. For tablet (under 1024px), use 8 columns. For mobile (under 640px), use a 4-column layout.
- **Rhythm:** Spacing follows a linear 8px scale. Generous whitespace (xl spacing) is required between major sections to allow the glassmorphic elements "room to breathe" and prevent the UI from feeling cluttered.
- **Alignment:** Content should be strictly aligned to the grid, but interactive elements (like floating action bars) can break the grid to create depth.

## Elevation & Depth
Depth is created through **Luminous Layering** rather than traditional black shadows.

1.  **Floor:** The deep navy background.
2.  **Surface:** Glassmorphic cards with a `backdrop-filter: blur(20px)` and a subtle `0.5px` white inner stroke at 10% opacity.
3.  **Rise:** When elements are hovered, they gain a secondary outer glow using the primary electric blue at very low opacity (10-15%) and a wider blur (32px).
4.  **Floating:** Overlays (modals, dropdowns) use a darker glass (`rgba(0,0,0,0.4)`) to create a "tint" effect, separating them from the main UI layers.

## Shapes
The shape language is "Calculated Softness." Elements use a 0.5rem (8px) base radius, which provides a modern feel that is neither too sharp nor too playful. Large cards and containers should scale up to `rounded-xl` (1.5rem) to emphasize the "object" quality of the glass panels.

## Components
- **Buttons:** Primary buttons use a solid Electric Blue with white text. Secondary buttons are "Ghost Glass"—transparent with a 1px border and a subtle hover shimmer effect.
- **Glass Cards:** The signature component. Must include a 1px top-left highlight border to simulate light hitting the edge of the glass.
- **Chips/Badges:** Use JetBrains Mono text. Backgrounds should be highly desaturated versions of the status color (e.g., a deep forest green for "Success" labels) with high-contrast text.
- **Input Fields:** Minimalist design with only a bottom border in inactive states, expanding to a full glass container with a blue glow on focus.
- **Data Visualizations:** Use "Neon Wireframes." Graphs should use thin lines (1.5px) with a soft glow (drop-shadow) in the same color as the line.
- **Quantum Status Indicator:** A custom component—a small, pulsating dot with two concentric rings of varying opacity to show system "liveness."