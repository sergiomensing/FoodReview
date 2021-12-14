const DEFAULT_FONT_SIZE = 16;

export const convertRemToPixels = (rem: string | number) => {
  const _rem = typeof rem === 'string' ? parseFloat(rem.replace('rem', '').trim()) : rem;
  const fontSize =
    typeof getComputedStyle !== 'undefined'
      ? parseFloat(getComputedStyle(document.documentElement).fontSize)
      : DEFAULT_FONT_SIZE;
  return _rem * fontSize;
};
