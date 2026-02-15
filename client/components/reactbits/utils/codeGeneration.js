export const formatPropValue = (value, name) => {
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'number' || typeof value === 'boolean') return `{${value}}`;
  if (Array.isArray(value) || typeof value === 'object') return `{${JSON.stringify(value)}}`;
  return `{${value}}`;
};
