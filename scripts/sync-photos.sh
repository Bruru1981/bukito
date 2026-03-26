#!/bin/bash
# Sync all Bukito photos from Supabase Storage
set -e
cd "$(dirname "$0")/.."
mkdir -p photos

SUPABASE_URL="https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book/photos"

for photo in BUKITO_IG1.webp BUKITO_IG3.webp BUKITO_IG7.webp BUKITO_IG11.webp BUKITO_IG15.webp BUKITO_IG19.webp BUKITO_IG22.webp BUKITO_IG24.webp bukito-barista.webp bukito-exterior.webp; do
    if [ ! -f "photos/$photo" ]; then
        echo "Downloading $photo..."
        curl -sL "$SUPABASE_URL/$photo" -o "photos/$photo"
    else
        echo "Already have $photo"
    fi
done

echo "Done! $(ls photos/*.webp | wc -l | tr -d ' ') photos available."
