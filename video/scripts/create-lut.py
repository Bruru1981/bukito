#!/usr/bin/env python3
"""
Bukito "Golden Standard" LUT Generator

Generates a .cube LUT file that captures Kristof's warm analog film aesthetic:
- Warm color temperature (+15-20%)
- Lifted blacks (shadows to ~15-20 / 255)
- Slight desaturation (-10-15%)
- Warm shadows (amber/brown push)
- Cool highlights (subtle blue)
- Gentle S-curve contrast
- Film-like tone curve with subtle grain characteristics

Output: 33x33x33 .cube LUT compatible with Lightroom, DaVinci Resolve,
        Final Cut Pro, Premiere Pro, and any .cube-supporting editor.
"""

import os
import math
from pathlib import Path


# ---------------------------------------------------------------------------
# Bukito Grading Parameters
# ---------------------------------------------------------------------------

# Lifted blacks: minimum output level (0-1 range, ~18/255 = 0.071)
LIFT_BLACKS = 0.071

# Desaturation factor (1.0 = no change, 0.85 = 15% desat)
DESATURATION = 0.87

# Warm shift: extra red/green added to shadows for amber/brown push
SHADOW_WARM_R = 0.025  # push red into shadows
SHADOW_WARM_G = 0.012  # slight green warmth in shadows
SHADOW_COOL_B = -0.008  # pull blue from shadows

# Highlight cool shift: subtle blue in highlights
HIGHLIGHT_COOL_R = -0.010
HIGHLIGHT_COOL_G = -0.005
HIGHLIGHT_COOL_B = 0.020

# Warm color temperature: overall warm shift
TEMP_WARM_R = 0.03  # boost red channel ~3%
TEMP_WARM_G = 0.01  # tiny green boost for natural warmth
TEMP_WARM_B = -0.04  # reduce blue ~4% for warmth

# S-curve contrast parameters
CONTRAST_MIDPOINT = 0.5
CONTRAST_STRENGTH = 0.15  # gentle S-curve

# LUT size (industry standard for high-quality color grading)
LUT_SIZE = 33


# ---------------------------------------------------------------------------
# Color Transform Functions
# ---------------------------------------------------------------------------


def s_curve(x: float, strength: float = CONTRAST_STRENGTH) -> float:
    """Apply a gentle S-curve contrast.

    Uses a sine-based S-curve which produces smooth, film-like contrast
    without harsh clipping. The strength parameter controls how pronounced
    the S-curve is.
    """
    # Sine-based S-curve centered at 0.5
    return x + strength * math.sin(2.0 * math.pi * (x - 0.5)) / (2.0 * math.pi)


def film_tone_curve(x: float) -> float:
    """Apply a film-like tone curve with shoulder rolloff.

    Film stocks have a characteristic response where:
    - Toe region (shadows): compressed, lifted
    - Mid region: roughly linear
    - Shoulder region (highlights): gentle rolloff, not hard clip

    This simulates that behavior for a warm analog aesthetic.
    """
    # Lift blacks
    x = LIFT_BLACKS + x * (1.0 - LIFT_BLACKS)

    # Apply S-curve for contrast
    x = s_curve(x)

    # Film shoulder: gentle highlight rolloff
    # Prevents harsh highlight clipping, keeps that analog softness
    if x > 0.75:
        excess = x - 0.75
        x = 0.75 + excess * (1.0 - excess * 0.4)

    return max(0.0, min(1.0, x))


def desaturate(r: float, g: float, b: float, factor: float) -> tuple[float, float, float]:
    """Reduce saturation by blending toward luminance.

    Uses Rec. 709 luminance coefficients for perceptually accurate
    desaturation, matching how the human eye perceives brightness.
    """
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    r = lum + (r - lum) * factor
    g = lum + (g - lum) * factor
    b = lum + (b - lum) * factor
    return r, g, b


def warm_shadows(r: float, g: float, b: float, luminance: float) -> tuple[float, float, float]:
    """Push shadows toward amber/brown.

    The effect fades out as luminance increases, only affecting
    the shadow and lower-midtone range. This creates the warm,
    cozy shadow tone characteristic of analog film.
    """
    # Shadow influence: strongest in deep shadows, fades by midtones
    shadow_weight = max(0.0, 1.0 - luminance * 2.5)
    shadow_weight = shadow_weight ** 1.5  # ease the falloff

    r += SHADOW_WARM_R * shadow_weight
    g += SHADOW_WARM_G * shadow_weight
    b += SHADOW_COOL_B * shadow_weight

    return r, g, b


def cool_highlights(r: float, g: float, b: float, luminance: float) -> tuple[float, float, float]:
    """Add subtle cool blue tone to highlights.

    Very gentle — just enough to create color contrast between warm shadows
    and slightly cool highlights, which is a hallmark of cinematic color grading.
    """
    # Highlight influence: only kicks in above midtones
    highlight_weight = max(0.0, (luminance - 0.5) * 2.0)
    highlight_weight = highlight_weight ** 2.0  # smooth onset

    r += HIGHLIGHT_COOL_R * highlight_weight
    g += HIGHLIGHT_COOL_G * highlight_weight
    b += HIGHLIGHT_COOL_B * highlight_weight

    return r, g, b


def apply_temperature(r: float, g: float, b: float) -> tuple[float, float, float]:
    """Apply overall warm color temperature shift.

    Boosts reds, slightly boosts greens, reduces blues — creating
    that warm, golden-hour quality throughout the tonal range.
    """
    r += TEMP_WARM_R
    g += TEMP_WARM_G
    b += TEMP_WARM_B
    return r, g, b


def transform_color(r: float, g: float, b: float) -> tuple[float, float, float]:
    """Full Bukito Golden Standard color transform pipeline.

    Order matters — each step builds on the previous:
    1. Temperature shift (overall warmth)
    2. Film tone curve (lifted blacks, contrast, shoulder)
    3. Shadow warming (amber push in darks)
    4. Highlight cooling (subtle blue in brights)
    5. Desaturation (slight, for that faded film look)
    """
    # Step 1: Warm color temperature
    r, g, b = apply_temperature(r, g, b)

    # Step 2: Apply film tone curve per channel
    r = film_tone_curve(r)
    g = film_tone_curve(g)
    b = film_tone_curve(b)

    # Calculate luminance for position-dependent effects
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b

    # Step 3: Warm the shadows
    r, g, b = warm_shadows(r, g, b, lum)

    # Step 4: Cool the highlights
    r, g, b = cool_highlights(r, g, b, lum)

    # Step 5: Slight desaturation for film look
    r, g, b = desaturate(r, g, b, DESATURATION)

    # Clamp to valid range
    r = max(0.0, min(1.0, r))
    g = max(0.0, min(1.0, g))
    b = max(0.0, min(1.0, b))

    return r, g, b


# ---------------------------------------------------------------------------
# .cube LUT File Generation
# ---------------------------------------------------------------------------


def generate_cube_lut(output_path: str, size: int = LUT_SIZE) -> None:
    """Generate a .cube LUT file.

    The .cube format stores a 3D lookup table as a text file.
    Structure:
    - Header with title, size, and domain range
    - RGB triplets for each point in the 3D grid
    - Iteration order: R fastest, then G, then B (standard .cube order)

    A 33x33x33 LUT = 35,937 entries, which is the standard size
    for professional color grading (good balance of accuracy vs file size).
    """
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    total = size * size * size
    print(f"Generating Bukito Golden Standard LUT ({size}x{size}x{size} = {total:,} entries)...")

    with open(output_path, "w") as f:
        # Header
        f.write("# Bukito Golden Standard LUT\n")
        f.write("# Warm analog film aesthetic by Kristof\n")
        f.write("# Generated for use in Lightroom, DaVinci Resolve, Final Cut Pro\n")
        f.write("# Recommended intensity: 70-85%% (never 100%%)\n")
        f.write("#\n")
        f.write('TITLE "Bukito Golden Standard"\n')
        f.write(f"LUT_3D_SIZE {size}\n")
        f.write("DOMAIN_MIN 0.0 0.0 0.0\n")
        f.write("DOMAIN_MAX 1.0 1.0 1.0\n")
        f.write("\n")

        # Generate LUT data
        # .cube format iterates: B slowest, G middle, R fastest
        count = 0
        for b_idx in range(size):
            for g_idx in range(size):
                for r_idx in range(size):
                    # Normalize input to 0-1 range
                    r_in = r_idx / (size - 1)
                    g_in = g_idx / (size - 1)
                    b_in = b_idx / (size - 1)

                    # Apply Bukito transform
                    r_out, g_out, b_out = transform_color(r_in, g_in, b_in)

                    # Write with 6 decimal places (standard precision)
                    f.write(f"{r_out:.6f} {g_out:.6f} {b_out:.6f}\n")

                    count += 1

        if count % 10000 == 0:
            pass  # progress tracking placeholder

    file_size = os.path.getsize(output_path)
    print(f"Done! Written {count:,} entries to: {output_path}")
    print(f"File size: {file_size / 1024:.1f} KB")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Output path: bukito-brand-assets/lut/
    script_dir = Path(__file__).resolve().parent
    # Navigate from bukito-video/scripts/ to bukito-brand-assets/lut/
    output_path = Path.home() / "bukito-brand-assets" / "lut" / "BUKITO_GoldenStandard.cube"

    generate_cube_lut(str(output_path))

    print("\nBukito Golden Standard LUT ready.")
    print("Import into your editor:")
    print("  Lightroom: Edit > Profiles > Browse > Import")
    print("  DaVinci Resolve: Color > LUTs > right-click > Add")
    print("  Final Cut Pro: Inspector > Color > Add Custom LUT")
    print("\nRecommended intensity: 70-85% (never apply at 100%)")
