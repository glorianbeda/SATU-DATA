# Design: Restore Auth Layout

## Layout Structure
- **Container**: Flexbox, full screen height (`h-screen`), full width (`w-full`), `overflow-hidden`.
- **Left Panel** (Branding):
  - Width: `w-5/12` (desktop), `hidden` (mobile).
  - Content: Background image (`loginImage`), Overlay (`bg-blue-600/70`), Branding text (`app_name`, `app_tagline`).
- **Right Panel** (Form):
  - Width: `w-7/12` (desktop), `w-full` (mobile).
  - Alignment: Flex center (`items-center justify-center`).
  - Content: `AnimatePresence` wrapping the active form component.

## Animation
- The animation logic remains the same (slide in/out), but it is constrained to the Right Panel.
