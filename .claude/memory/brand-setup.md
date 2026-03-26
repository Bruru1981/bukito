---
name: Bukito brand infrastructure
type: reference
---

## Supabase Project: Brand Books
- Project ref: `glmgwaywptqlzudoiwot`
- Region: eu-north-1
- Storage bucket: `media` (public, 50MB limit)
- Storage folder: `Bukito brand book/`
- Subfolders: photos/, logos/, wordmarks/, icons/, stamps/, patterns/
- Tables: `media` (file metadata), `media_categories` (food, interior, branding, social, events, team)
- RLS: public read, authenticated write
- Storage URL: `https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book`

## GitHub Repos
- Brand assets: Bruru1981/bukito-brand-assets (logos, icons, fonts, stamps, patterns, templates)
- Website: Bruru1981/bukito-web (this repo)

## MCP Configuration
- Global Supabase MCP (in ~/.claude/settings.json) = READ-ONLY
- For writes: override in project's .claude/settings.json with --project-ref
- Token: SUPABASE_ACCESS_TOKEN in mcpServers.supabase.env

## Supabase CLI for Writes
- `supabase init --force` + `supabase link --project-ref glmgwaywptqlzudoiwot`
- Migrations in `supabase/migrations/` (YYYYMMDDHHMMSS_name.sql)
- Apply with `supabase db push`

## Still TODO
- Postiz Docker setup for Instagram + TikTok scheduling
