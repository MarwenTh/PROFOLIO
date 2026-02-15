export const getLanguage = (name) => {
  if (!name) return 'jsx';
  const n = name.toLowerCase();
  if (n.includes('css')) return 'css';
  if (n.includes('bash') || n.includes('cli')) return 'bash';
  if (n.includes('ts')) return 'tsx';
  return 'jsx';
};
