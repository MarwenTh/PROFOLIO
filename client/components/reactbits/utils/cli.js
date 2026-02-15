export const generateCliCommands = (language, style, category, subcategory, deps) => {
  return `npx shadcn@latest add "https://reactbits.dev/default/${category}/${subcategory}"`;
};
