---
name: Consolidated team feedback
type: feedback
---

## "Rebuild" means FROM SCRATCH
When asked to "rebuild from scratch" or "build v2/v3", create a genuinely NEW design — new layout, new sections, new animations. NOT the same layout with SEO improvements. Brand rules stay, structure changes completely.

## Supabase MCP must persist
NEVER remove or modify the supabase mcpServers entry in global settings. Global config = READ-ONLY. For writes, use project-scoped .claude/settings.json with --project-ref.

## Use CLI for DB writes
When global MCP blocks writes, use `supabase db push` instead of asking the user to paste SQL.

## Alice font readability
Smallest font must be at least 11px. Alice found 8-9px text unreadable on mobile. Minimum floor: 11px for whisper text, 12px (text-xs) for labels.

## No orange as primary accent
User doesn't like orange as a dominant accent on the website. Use Sunrust (#6D0000) and Black (#000000) as the main color pair. Orange stays in the brand palette for social media events only.
