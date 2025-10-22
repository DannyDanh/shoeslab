// client/src/utilities/calcPrice.js

// --- Price tables (example values — adjust as you like) ---
export const SIZE_PRICE = {
  6: 0, 7: 0, 8: 0, 9: 5, 10: 5, 11: 10, 12: 10,
};

export const BRAND_PRICE = {
  1: 40, // SoleTech
  2: 30, // StridePro
  3: 35, // AeroRun
};

export const TYPE_PRICE = {
  10: 25, // Runner
  11: 20, // Trainer
  12: 15, // Casual
};

export const COLOR_PRICE = {
  20: 0,   // Black
  21: 0,   // White
  22: 5,   // Red (premium)
  23: 5,   // Blue (premium)
};

export const CUSHION_PRICE = {
  32: 20,  // Air Pocket
  33: 15,  // Foam Flex
  34: 18,  // Gel Glide
};

export const CUSHION_COLOR_PRICE = {
  41: 8,  // Neon Yellow
  42: 8,  // Electric Blue
  43: 8,  // Crimson Red
};

export const LACE_COLOR_PRICE = {
  51: 0,  // Black Contrast
  52: 0,  // White Classic
  53: 3,  // Gray Blend (premium)
};

// Optional base price for every shoe
export const BASE_PRICE = 60;

// --- helpers ---
export function getOptionPrice(table, id) {
  return table?.[id] ?? 0;
}

export function formatPrice(amount, currency = 'USD', locale = 'en-US') {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    return `$${Number(amount).toFixed(2)}`;
  }
}

/**
 * calcTotalPrice(config)
 * config = {
 *   sizeId, brandId, typeId, colorId,
 *   cushionId, cushionColorId, laceColorId
 * }
 */
export function calcTotalPrice(config) {
  if (!config) return BASE_PRICE;

  const {
    sizeId, brandId, typeId, colorId,
    cushionId, cushionColorId, laceColorId,
  } = config;

  const total =
    BASE_PRICE +
    getOptionPrice(SIZE_PRICE, sizeId) +
    getOptionPrice(BRAND_PRICE, brandId) +
    getOptionPrice(TYPE_PRICE, typeId) +
    getOptionPrice(COLOR_PRICE, colorId) +
    getOptionPrice(CUSHION_PRICE, cushionId) +
    getOptionPrice(CUSHION_COLOR_PRICE, cushionColorId) +
    getOptionPrice(LACE_COLOR_PRICE, laceColorId);

  return total;
}
