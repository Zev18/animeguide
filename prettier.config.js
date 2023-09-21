const config = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: true,
  semi: true,
  singleQuote: true,
  trailingComma: "es5",
  bracketSpacing: true,
  jsxBracketSameLine: true,
  arrowParens: "avoid",
  proseWrap: "always",
};

module.exports = {
  config,
  plugins: ["prettier-plugin-tailwindcss"],
};
