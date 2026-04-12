# Handoff — Bukito V2 Redesign + Admin CMS

**Date**: 2026-04-12
**Session goal**: Complete v2 website redesign with full admin CMS backed by Supabase

## Current State

### What Works
- **V2 website** at `/v2` — 9 sections, all wired to Supabase with hardcoded fallbacks
  - `src/app/v2/sections/GateScene.tsx` — hero video, reads `site_settings.hero`
  - `src/app/v2/sections/ApproachScene.tsx` — jungle photos + 3D tilt, reads `site_settings.approach`
  - `src/app/v2/sections/IdentityScene.tsx` — about blurb, reads `site_settings.about_blurb`
  - `src/app/v2/sections/TableScene.tsx` — menu from `menu_categories` + `menu_items` tables
  - `src/app/v2/sections/GalleryScene.tsx` — photo scroller, dynamic from Supabase Storage
  - `src/app/v2/sections/TurnScene.tsx` — day/night transition, reads `site_settings.transition`
  - `src/app/v2/sections/NightScene.tsx` — journal from `blog_posts` + playlists from `playlists`
  - `src/app/v2/sections/PathScene.tsx` — snake journey map (brand serpent PNG)
  - `src/app/v2/sections/SealScene.tsx` — footer, reads `site_settings.contact` + `social`
- **Components**: CursorFollower (cat icon), TiltPhoto (3D), ClipReveal, ScrollProgress
- **Supabase helpers**: `src/lib/supabase-fetch.ts` and `src/lib/supabase.ts`
- **API routes** at `src/app/api/admin/` — settings, menu, menu/items, posts, playlists, media, storage, upload
- **BrandTab** at `src/app/admin/BrandTab.tsx` — asset manager with upload for logos/wordmarks/icons/photos/videos
- All accessibility fixes applied (focus-visible, reduced-motion, aria, skip-to-content)

### What's BROKEN (Fix First)
**`src/app/admin/page.tsx` is truncated** — only 599 lines. The tab components (SettingsTab, MenuTab, JournalTab, PlaylistsTab) were accidentally removed. The main AdminPage component exists and references them, but they're gone.

**Fix**: Rebuild the 4 tab components. They should:
- `SettingsTab` — about blurb textarea + ImagePicker, contact (address/city/WhatsApp/email), per-day hours (Mon-Sun), social links. Also needs editors for hero/approach/transition/gallery/journey text from `site_settings`.
- `MenuTab` — CRUD menu categories + items from Supabase
- `JournalTab` — CRUD blog posts with Supabase image/video pickers, gallery picker, share button. Auto-seed 3 posts if DB empty.
- `PlaylistsTab` — CRUD playlists

BrandTab is fine in its own file. API routes all work. Database has data.

## Supabase
- **Ref**: `glmgwaywptqlzudoiwot`, region: eu-north-1
- **Tables**: site_settings (8 keys: hero, approach, transition, gallery, journey, contact, hours, social, about_blurb), menu_categories (6), menu_items (27), blog_posts (3 seeded), playlists (4), media, media_categories
- **Storage**: `media` bucket, folders: logos/, wordmarks/, icons/, stamps/, patterns/, photos/, videos/
- **Keys**: in `.env.local` (NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY, ADMIN_PASSWORD=bukito2024)

## Key Files
```
src/lib/supabase-fetch.ts    — fetchSiteSetting<T>(key), supabaseGet<T>(path)
src/lib/supabase.ts          — createClient instances (public + admin)
src/app/admin/BrandTab.tsx   — standalone brand asset manager component
src/app/admin/page.tsx       — BROKEN (needs tab components rebuilt)
src/app/api/admin/           — all CRUD routes working
src/app/v2/                  — complete v2 site wired to Supabase
```

## Next Steps
1. **Rebuild admin page tab components** — priority #1
2. **Add section text editors to Settings tab** — hero tagline, approach text, transition text, gallery heading, journey data
3. **Test end-to-end** — edit in admin, verify on /v2
4. **Commit** — 27+ uncommitted files

## Failed Approaches (Don't Repeat)
- First v2 was a copy of original — redesign from scratch with creative direction
- SVG snake for journey — user wants actual brand Serpent PNG
- Public /brand-book page — brand book lives in GitHub repo, not a webpage
- Truncating admin page at line 599 removed tab components — don't truncate, use targeted edits
