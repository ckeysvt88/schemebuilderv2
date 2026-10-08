// Keep team headers at full color and choose readable text for each color.
const DEFAULT_PRIMARY = '#507890';
const DEFAULT_SECONDARY = '#FFFFFF';

function normalizeColor(value, fallback) {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)
    ? value.toUpperCase()
    : fallback;
}

function luminance(color) {
  const channels = [1, 3, 5].map(offset => {
    const value = parseInt(color.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function textColor(background) {
  const light = luminance(background);
  const blackContrast = (light + 0.05) / 0.05;
  const whiteContrast = 1.05 / (light + 0.05);
  return blackContrast >= whiteContrast ? '#000000' : '#FFFFFF';
}

export function getTeamHeaderColors(team) {
  const primary = normalizeColor(team?.color, DEFAULT_PRIMARY);
  const secondary = normalizeColor(team?.secondaryColor, DEFAULT_SECONDARY);
  return {
    primary,
    secondary,
    primaryText: textColor(primary),
    secondaryText: textColor(secondary),
  };
}
