import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Desativa aviso de variáveis não usadas
      "@typescript-eslint/no-explicit-any": "off", // Permite "any" sem erro
      "prefer-const": "off" // Permite o uso de "let" mesmo sem reatribuição
    }
  }
];

export default eslintConfig;
