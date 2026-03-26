# Bukito Website

Restaurant and coffee bar in Kertasari, Sumbawa Barat, Indonesia.
**"Paradise With Fangs"**

@AGENTS.md

## Stack
Next.js 16 + TypeScript + Tailwind v4 + Framer Motion 12 + Lenis (smooth scroll)

## Brand
All brand rules live in `.claude/skills/bukito/SKILL.md`. Load this skill when doing any design or content work.

## Agents
- **Rubin** (global skill) — Design Director. Invoke for visual design, website, menus, brand materials.
- **Helena** (global skill) — Marketing Director. Invoke for copy, SEO, social strategy, content planning.
- Both are brand-agnostic — they read this project's brand skill to know what brand they're working on.

## Collaboration (Rubin + Alice)
Memory lives in `.claude/memory/` in this repo. Before working: `git pull`. After updating memory: commit and push. This is how context syncs between collaborators.

## Key References
- Supabase project: `glmgwaywptqlzudoiwot` (storage for photos, logos, icons)
- Storage URL: `https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book`
- Brand assets: `./brand-assets/` (gitignored, clone from GitHub: Bruru1981/bukito-brand-assets)
- Brand dashboard: `localhost:3000/brand` (run dev server, see fonts + photos + colors)

## Rules
- Fonts: Kisrre (primary, ALL CAPS), Kisrre-Rounded (secondary). Files in `public/fonts/`.
- Colors: Sunrust (#6D0000) on Coconut Sand (#F8F5EA). Black Magic (#000000) for dark sections.
- Minimum font size: 11px (Alice's readability requirement)
- NEVER use stock photos or AI-generated images
- Prices in Jungle Green (#008134)
- `npm run build` must pass before any deploy
