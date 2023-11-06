const hue2rgb = (p: number, q: number, t: number) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

export class ColorUtils {
  static hslToRgb(h: number, s: number, l: number) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // Оттенок отсутствует, поэтому цвет - оттенок серого
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    // Преобразуем значения RGB в диапазоне от 0 до 255 в строку "rgb( r, g, b )"
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);

    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }

  static getRandomColorExcludingBlue() {
    const minHue = 0; // Минимальное значение оттенка (красный)
    const maxHue = 240; // Максимальное значение оттенка (зеленый)

    const hue = Math.floor(Math.random() * (maxHue - minHue + 1)) + minHue;
    const saturation = Math.random();
    const lightness = Math.random();

    // Преобразуем HSL-цвет в RGB-цвет
    const rgbColor = ColorUtils.hslToRgb(hue / 360, saturation, lightness);

    // Преобразуем RGB-цвет в диапазон от 0 до 1
    const r = parseInt(rgbColor.substring(4, rgbColor.indexOf(','))) / 255;
    const g =
      parseInt(rgbColor.substring(rgbColor.indexOf(',') + 2, rgbColor.lastIndexOf(','))) / 255;
    const b =
      parseInt(rgbColor.substring(rgbColor.lastIndexOf(',') + 2, rgbColor.lastIndexOf(')'))) / 255;

    return [r, g, b];
  }
}
