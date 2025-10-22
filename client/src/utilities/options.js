// client/src/utilities/options.js

export const sizes = [6, 7, 8, 9, 10, 11, 12];

export const brands = [
  { id: 1, name: 'SoleTech' },
  { id: 2, name: 'StridePro' },
  { id: 3, name: 'AeroRun' },
];

export const types = [
  { id: 10, name: 'Runner' },
  { id: 11, name: 'Trainer' },
  { id: 12, name: 'Casual' },
];

export const colors = [
  { id: 20, name: 'Black', hex: '#111111' },
  { id: 21, name: 'White', hex: '#ffffff', border: '#e5e7eb' },
  { id: 22, name: 'Red',   hex: '#dc2626' },
  { id: 23, name: 'Blue',  hex: '#2563eb' },
];

export const cushions = [
  { id: 32, name: 'Air Pocket' },
  { id: 33, name: 'Foam Flex' },
  { id: 34, name: 'Gel Glide' },
];

export const cushionColors = [
  { id: 41, name: 'Neon Yellow',  hex: '#d4ff00' },
  { id: 42, name: 'Electric Blue',hex: '#00c2ff' },
  { id: 43, name: 'Crimson Red',  hex: '#b91c1c' },
];

export const laceColors = [
  { id: 51, name: 'Black Contrast', hex: '#111111' },
  { id: 52, name: 'White Classic',  hex: '#ffffff', border: '#e5e7eb' },
  { id: 53, name: 'Gray Blend',     hex: '#6b7280' },
];

// helpers
export const toMap = (arr) => Object.fromEntries(arr.map(x => [x.id, x]));
export const nameFrom = (arr) => {
  const map = toMap(arr);
  return (id) => map[id]?.name ?? id;
};
export const hexFrom = (arr) => {
  const map = toMap(arr);
  return (id) => map[id]?.hex ?? undefined;
};
export const borderFrom = (arr) => {
  const map = toMap(arr);
  return (id) => map[id]?.border ?? undefined;
};
