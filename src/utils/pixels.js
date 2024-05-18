/**
 * Parses a value and returns a number if possible. If the value is not a number or a string,
 * returns 0. If the value is a string, it will attempt to parse it as a pixel or rem value.
 * @param {number|string} [value=0] - The value to parse.
 * @returns {number} - The parsed value as a number.
 */
export const parse = (value = 0) => {
  const type = typeof value;
  if (type === "number") return value;
  if (type !== "string") return 0;
  if (/^\d+px/.test(value)) return parseFloat(value, 10);
  if (/^\d+rem/.test(value)) return parseFloat(value) * 16;
  return value;
};

export const stringify = (value = 0) =>
  !!parse(value) ? `${parse(value)}px` : value;
