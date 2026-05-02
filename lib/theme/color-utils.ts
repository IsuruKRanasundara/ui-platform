function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function hslToHex(hsl: string) {
  const [hValue, sValue, lValue] = hsl.replace(/%/g, '').split(/\s+/).map(Number);
  const saturation = sValue / 100;
  const lightness = lValue / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const hueSegment = hValue / 60;
  const intermediate = chroma * (1 - Math.abs((hueSegment % 2) - 1));

  let red = 0;
  let green = 0;
  let blue = 0;

  if (hueSegment >= 0 && hueSegment < 1) {
    red = chroma;
    green = intermediate;
  } else if (hueSegment < 2) {
    red = intermediate;
    green = chroma;
  } else if (hueSegment < 3) {
    green = chroma;
    blue = intermediate;
  } else if (hueSegment < 4) {
    green = intermediate;
    blue = chroma;
  } else if (hueSegment < 5) {
    red = intermediate;
    blue = chroma;
  } else {
    red = chroma;
    blue = intermediate;
  }

  const match = lightness - chroma / 2;
  const [r, g, b] = [red + match, green + match, blue + match].map((channel) =>
    clamp(Math.round(channel * 255), 0, 255)
  );

  return `#${[r, g, b]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`;
}

export function hexToHsl(hex: string) {
  const normalized = hex.replace('#', '').trim();
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((value) => `${value}${value}`)
          .join('')
      : normalized;

  const red = Number.parseInt(expanded.slice(0, 2), 16) / 255;
  const green = Number.parseInt(expanded.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(expanded.slice(4, 6), 16) / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));

    switch (max) {
      case red:
        hue = ((green - blue) / delta) % 6;
        break;
      case green:
        hue = (blue - red) / delta + 2;
        break;
      default:
        hue = (red - green) / delta + 4;
        break;
    }
  }

  const hueValue = Math.round((hue * 60 + 360) % 360);
  const saturationValue = Math.round(saturation * 1000) / 10;
  const lightnessValue = Math.round(lightness * 1000) / 10;

  return `${hueValue} ${saturationValue}% ${lightnessValue}%`;
}