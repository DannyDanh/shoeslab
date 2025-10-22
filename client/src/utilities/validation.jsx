// client/src/utilities/validation.js

/**
 * Validation rules return an array of violation objects:
 * { code, message, field?, severity? }
 * - code: short machine-readable identifier
 * - message: user-friendly explanation
 * - field: optional name of the field involved
 * - severity: 'error' | 'warning' (default 'error')
 *
 * You can add/remove rules as your product logic evolves.
 */

export function validateShoeConfig(cfg) {
  const v = [];

  if (!cfg) {
    v.push({ code: 'EMPTY_CONFIG', message: 'No configuration provided.' });
    return v;
  }

  const {
    shoeName, sizeId, brandId, typeId, colorId,
    cushionId, cushionColorId, laceColorId,
  } = cfg;

  // --- Requireds ---
  const requiredFields = {
    shoeName, sizeId, brandId, typeId, colorId, cushionId, cushionColorId, laceColorId,
  };
  for (const [k, val] of Object.entries(requiredFields)) {
    if (val === undefined || val === null || val === '') {
      v.push({ code: 'REQUIRED', field: k, message: `“${k}” is required.` });
    }
  }

  // --- Examples of business rules (customize freely) ---

  // R1: “Runner” type requires premium cushion (Air Pocket or Gel Glide)
  if (typeId === 10 /* Runner */ && ![32, 34].includes(cushionId)) {
    v.push({
      code: 'RUNNER_CUSHION',
      field: 'cushionId',
      message: 'Runner type requires Air Pocket or Gel Glide cushioning.',
    });
  }

  // R2: Neon Yellow cushion color not allowed with White lace color (clashes visually)
  if (cushionColorId === 41 /* Neon Yellow */ && laceColorId === 52 /* White Classic */) {
    v.push({
      code: 'NEON_WHITE_CLASH',
      field: 'laceColorId',
      severity: 'warning',
      message: 'Neon Yellow cushion with White laces may clash. Consider a darker lace color.',
    });
  }

  // R3: Brand “SoleTech” (1) cannot be combined with Color “Red” (22) (inventory constraint)
  if (brandId === 1 && colorId === 22) {
    v.push({
      code: 'BRAND_COLOR_BLOCK',
      field: 'colorId',
      message: 'SoleTech is not available in Red at the moment.',
    });
  }

  // R4: Size out-of-range guard
  if (typeof sizeId === 'number' && (sizeId < 6 || sizeId > 12)) {
    v.push({
      code: 'SIZE_RANGE',
      field: 'sizeId',
      message: 'Size must be between 6 and 12.',
    });
  }

  return v;
}

/**
 * explainViolations(violations)
 * - Formats violations to readable strings.
 */
export function explainViolations(violations = []) {
  if (!violations.length) return 'No issues found.';
  return violations
    .map(v => `${v.severity === 'warning' ? '⚠️' : '❌'} ${v.message}`)
    .join('\n');
}

/**
 * isValid(violations)
 * - Quick helper to check if there are blocking errors.
 */
export function isValid(violations = []) {
  return violations.every(v => v.severity === 'warning');
}
