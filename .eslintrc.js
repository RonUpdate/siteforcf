module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "next/core-web-vitals",
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks", "import", "jsx-a11y"],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    // Основные правила
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-unused-vars": "off", // Отключаем базовое правило в пользу TypeScript версии

    // TypeScript правила
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",

    // React правила
    "react/prop-types": "off", // Не нужно с TypeScript
    "react/react-in-jsx-scope": "off", // Не нужно в Next.js
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // Правила импортов
    "import/order": [
      "error",
      {
        groups: [
          "builtin", // Встроенные модули Node.js
          "external", // npm пакеты
          "internal", // Внутренние пути (настраиваемые)
          ["parent", "sibling"], // Родительские и соседние импорты
          "index", // Импорты из индексных файлов
          "object", // Импорты объектов
          "type", // Импорты типов
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: "react",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "next/**",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "@/components/**",
            group: "internal",
            position: "before",
          },
          {
            pattern: "@/utils/**",
            group: "internal",
            position: "before",
          },
          {
            pattern: "@/lib/**",
            group: "internal",
            position: "before",
          },
          {
            pattern: "@/hooks/**",
            group: "internal",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react", "next"],
      },
    ],
    "import/no-unresolved": "error",
    "import/no-cycle": "error", // Предотвращает циклические зависимости
    "import/no-unused-modules": "warn", // Предупреждает о неиспользуемых экспортах
    "import/no-duplicates": "error", // Запрещает дублирование импортов
    "import/first": "error", // Импорты должны быть первыми в файле
    "import/newline-after-import": "error", // Требует пустую строку после импортов
    "import/no-named-default": "error", // Запрещает именованный импорт по умолчанию
    "import/no-anonymous-default-export": "warn", // Предупреждает об анонимных экспортах по умолчанию
    "import/no-mutable-exports": "error", // Запрещает экспорт изменяемых переменных
    "import/no-useless-path-segments": "error", // Запрещает ненужные сегменты пути
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/prefer-default-export": "off", // Не требуем экспорт по умолчанию

    // Правила для типов
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"], // Предпочитаем импорт типов на верхнем уровне
  },
}
