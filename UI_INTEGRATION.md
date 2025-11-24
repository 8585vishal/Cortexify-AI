Project UI integration guide

Stack detection: Next.js + React + Tailwind CSS v4 detected.

What’s included
- Design tokens: `src/styles/tokens.css` (colors, spacing, radii, shadows, typography)
- Global styles: `src/styles/global.css` (normalize basics, focus rings, utilities)
- Components: button, input, card, modal, toast provider, navbar, table, badge
- Example pages: `/dashboard`, `/jobs`, `/auth/login`

How to use
1) Tokens and global CSS are already imported:
   - `app/globals.css` imports `../src/styles/tokens.css`
   - `app/layout.tsx` imports `../src/styles/global.css`

2) Wrap your app with the ToastProvider:
   - Already done in `app/layout.tsx` → `<ToastProvider>{children}</ToastProvider>`
   - Use in pages: `const { push } = useToast(); push({ title: 'Saved', description: 'Job posted' });`

3) Components
   - Import from `@/components/ui/...`
   - Examples:
     - `import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'`
     - `import { Modal } from '@/components/ui/modal'`
     - `import { Table, THead, TH, TR, TD, TBody } from '@/components/ui/table'`
     - `import { Badge } from '@/components/ui/badge'`

4) Tailwind theme
   - Tailwind v4 uses CSS-first. Tokens map into Tailwind via `@theme inline` in `app/globals.css`. No `tailwind.config.js` is required.

5) Accessibility
   - All form controls have labels; focus-visible rings are 3px and use `--ring`.

6) Pages
   - `/dashboard`: stat cards, skeleton loaders
   - `/jobs`: job list using cards and badges
   - `/auth/login`: labeled form using `.input` and `Button`

No further installs are required (Tailwind v4 is already configured).