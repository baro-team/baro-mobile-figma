## Issue #7 dependency and bundle optimization

### Dependency cleanup

- Production dependencies reduced from 55 to 5.
- Removed unused generated UI scaffold packages and large unused libraries, including:
  - MUI/Emotion: `@mui/*`, `@emotion/*`
  - Radix wrappers not used by the app flow: `@radix-ui/*`
  - Chart/form/datepicker/drag/router/carousel packages: `recharts`, `react-hook-form`, `react-day-picker`, `react-dnd`, `react-router`, `react-slick`, etc.
- Kept only runtime packages currently used by shipped screens:
  - `clsx`
  - `lucide-react`
  - `motion`
  - `tailwind-merge`
  - `tw-animate-css`

### Bundle comparison

Measured with `pnpm build`.

| Metric | Before | After |
| --- | ---: | ---: |
| Transformed modules | 2043 | 2037 |
| CSS bundle | 105.56 kB / gzip 17.14 kB | 42.37 kB / gzip 8.39 kB |
| JS bundle | 344.54 kB / gzip 110.35 kB | 343.04 kB / gzip 109.64 kB |

### Mobile responsive hardening

- Added `viewport-fit=cover` for iOS safe-area support.
- Routed screen height through `--app-viewport-height` so visual viewport changes can be reflected consistently.
- Added safe-area-aware mobile frame utilities.
- Added bottom-sheet max-height clamping while keeping the default expanded height content-first and handle-adjustable.
- Added shared 44px minimum touch target utility and focus rings for interactive controls.

### Validation

- `pnpm typecheck`
- `pnpm build`
- `pnpm lint`
- `pnpm test`
