/**
 * Generate a random hex color string like "#a3f2b1"
 */
export function randomHexColor(): string {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")
  return `#${hex}`
}

/**
 * Split a hex color into its R, G, B components for display
 */
export function splitHex(hex: string): { r: string; g: string; b: string } {
  const clean = hex.replace("#", "")
  return {
    r: clean.substring(0, 2),
    g: clean.substring(2, 4),
    b: clean.substring(4, 6),
  }
}

/**
 * Determine if a color is "light" (for choosing text contrast)
 */
export function isLightColor(hex: string): boolean {
  const clean = hex.replace("#", "")
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6
}
