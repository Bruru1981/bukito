---
name: bukito
description: "Bukito restaurant brand identity, content creation, and UGC curation. Enforces colors, typography, tone, asset usage, and content workflows. Triggers on: bukito brand, bukito content, bukito social, bukito ugc, work on bukito, bukito guidelines, show me the brand book."
---

# Bukito — Brand, Content & Community

**BUKITO** is a restaurant and coffee bar in Kertasari, Sumbawa Barat, Indonesia.
Tagline: **"Paradise With Fangs"**

## Git Sync Protocol

**CRITICAL — before ANY work session:**
1. `git pull` to get the latest memory and content changes
2. Do your work
3. If you updated any `.claude/memory/` files, `git add .claude/memory/ && git commit -m "chore: update brand memory" && git push`

This keeps all collaborators (Rubin, Alice, agents) synchronized. Memory lives in this repo, not in local `~/.claude/`.

---

## 1. Brand Identity

### Personality
Mystical, edgy, warm. NOT hyper-modern. Surf culture meets Belgian/local food meets tropical wildlife. Sparks curiosity, feels welcoming.

### Colors

#### Primary (90% of the time)
| Role | Name | Hex |
|------|------|-----|
| Foreground / text | Sunrust | `#6D0000` |
| Background | Coconut Sand | `#F8F5EA` |
| Dark mode foreground | Coconut Sand | `#F8F5EA` |
| Dark mode background | Black Magic | `#000000` |

#### Secondary (accents, events, specials — one per piece max)
| Name | Hex | When |
|------|-----|------|
| Jungle Green | `#008134` | Prices, freshness, specials |
| Orange Beach | `#E67E32` | Events, social media warmth |
| Wavy Blue | `#A8C8E8` | Light accent, ocean vibes |

### Typography

**Primary: Kisrre Regular** (`public/fonts/Kisrre.otf`)
- Tracking: -0.04em (tight — essential to brand)
- Case: ALL CAPS always — headlines AND body
- Kerning: Optical

**Secondary: Kisrre-Rounded** (`public/fonts/Kisrre-Rounded.otf`)
- Softer variant for descriptions, captions
- Same ALL CAPS rule

**Display: UDC Sign Painter Light** (in bukito-brand-assets repo)
- Hand-painted style for event posters, chalkboard menus
- Mixed case OK

**Hierarchy:**
- Display: 72-96px | Headline: 48-64px | Title: 28-36px | Body: 14-18px | Label: 11-12px

### Logo Usage
Variants in Supabase Storage (`media/Bukito brand book/logos/`):
- **SnakeBread** — primary (snake + bread)
- **SnakeCoffee** — coffee contexts
- **SnakePalm** — tropical/location contexts

Wordmarks: Clean, Distorted, Faded, WithAddress variants.
Rules: NEVER stretch, distort, or recolor outside palette. Minimum clear space = logo height.

### Icons
39 custom PNG icons in Supabase Storage (`media/Bukito brand book/icons/`).
Categories: Nature, Surf, Food, Wildlife, Spiritual.

### Photography Style
- Warm analog film aesthetic — grain, light leaks
- Tropical: palms, jungle, ocean, banana leaves
- Moody and atmospheric, NOT sterile or corporate
- NEVER use stock photos or AI-generated images

### Tone of Voice
- Mystical, intriguing, warm
- Short punchy copy: "NIGHT COFFEE AND JUNGLE WALKS"
- English primarily, with natural Bahasa Indonesia sprinkled in
- Conversational, part of the story — never corporate
- ALL CAPS in design (typography rule)

### Social Media
- Instagram: @bukito.sumbawa
- TikTok: @bukito.sumbawa
- Hashtags: #Bukito #BukitoSumbawa #ParadiseWithFangs

---

## 2. Content Creation

### Tools
| Tool | What | Output |
|------|------|--------|
| Paper MCP | Static posts & stories | PNG (design in canvas) |
| Remotion | Animated branded videos | MP4 (text overlays + transitions) |
| Runway API | AI video from still photo | MP4 (cinematic 5-10s clips) |

### Photo Library
- **Supabase**: project `glmgwaywptqlzudoiwot`, bucket `media`, path `Bukito brand book/photos/`
- **Local repo**: `public/photos/` (webp format, used by website)
- **Google Drive**: See `.claude/memory/photo-library.md` for full paths

### Content Templates

**Static Post — Menu Highlight** (Paper, 1080x1080):
Photo top 63% with gradient fade to Coconut Sand. Label + Title + Desc + Footer below.

**Static Post — Vibe** (Paper, 1080x1080):
Full-bleed photo, dark gradient overlay bottom, editorial text bottom-left.

**Static Post — Event** (Paper, 1080x1080):
Typography-only poster, no photo. Date + Headline + Desc + Price.

**Story — Weekly Special** (Paper, 1080x1920):
Dark mode, centered, full-bleed photo background + gradient.

**AI Video Clip** (Runway):
```bash
cd ~/Documents/Software\ Projects/bukito-video
npx tsx scripts/image-to-video.ts <PHOTO> [PROMPT] [DURATION] [RATIO]
```

**Composed Video** (Remotion):
Edit in `~/Documents/Software Projects/bukito-video/`. Render with `npx remotion render`.

### Copy Rules
- ALL CAPS always
- Short, punchy, mystical
- Menu: NAME + INGREDIENTS + PRICE (Rp XX.000)
- Events: NAME + TIME + PRICE + ONE-LINE HOOK

### Weekly Workflow
1. Pick theme (menu item, event, vibe, weekly special)
2. Select 1-2 photos from library
3. Generate AI video if needed (Runway)
4. Create static post (Paper) and/or video (Remotion)
5. Export PNG/MP4
6. Post to @bukito.sumbawa

---

## 3. UGC — User-Generated Content

### Hashtags to Monitor
`#Bukito`, `#BukitoSumbawa`, `#ParadiseWithFangs`, `#Kertasari`, `#SumbawaSurf`

### Workflow
1. **Discover** — Search hashtags weekly on Instagram/TikTok
2. **Select** — Warm lighting, authentic moments, good composition, Bukito vibe
3. **Request Permission** — DM the creator:
   - EN: "Hey [name]! We love this shot of Bukito! Would you mind if we share it on our feed? We'll tag you of course. Thanks!"
   - ID: "Hai [nama]! Kami suka banget foto Bukito-nya! Boleh nggak kalau kami share di feed kami? Pasti kami tag ya. Makasih!"
4. **Design** — Create branded repost (Paper MCP, 1080x1080)
5. **Publish** — Post with credit via Postiz
6. **Track** — Log in content_analytics with post_type: 'ugc'

### Selection Criteria
YES: warm natural lighting, authentic food/atmosphere, relaxed tropical vibe, real moments.
NO: blurry/dark/heavy filters, other brand logos, negative context, screenshots/memes.

### Frequency
1 UGC repost per week. Never 2 in a row. Share tagged stories daily when available.

---

## 4. Asset Locations

| Asset | Location |
|-------|----------|
| Logos, wordmarks, icons | Supabase Storage: `media/Bukito brand book/` |
| Fonts | `public/fonts/` (Kisrre.otf, Kisrre-Rounded.otf) |
| Website photos | `public/photos/` (webp) |
| Source photos (PNGs) | Google Drive (see `.claude/memory/photo-library.md`) |
| Brand assets repo | `~/bukito-brand-assets` (GitHub: Bruru1981/bukito-brand-assets) |
| Stamps, patterns | `public/` (BUKITO_StampDistorted.png, BUKITO_Pattern.png) |
| Videos | `public/videos/` |
| Supabase project | ref: `glmgwaywptqlzudoiwot`, region: eu-north-1 |
| Supabase storage URL | `https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book` |

---

## 5. Brand Dashboard

Run `npm run dev` and visit `localhost:3000/brand` to see:
- Color palette with swatches
- Typography preview at all sizes
- Logo and icon gallery from Supabase
- Photo browser
- Font and connectivity status
