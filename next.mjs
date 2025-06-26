// Utilitários para obter diretório atual no formato ESM
import { dirname } from 'path'
import { fileURLToPath } from 'url'

// Suporte para configs legadas com FlatCompat (ex: extends antigos)
import { FlatCompat } from '@eslint/eslintrc'

// Importa o parser do TypeScript para usar como chave no settings
import typescriptParser from '@typescript-eslint/parser'

// Determina caminho do arquivo atual e seu diretório (modo ESM)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Inicializa compatibilidade para configs tradicionais (como 'extends')
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const next = [
  {
    ignores: [
      '**/node_modules/**/*',
      '**/dist/**/*',
      '**/build/**/*',
      '**/*.d.ts',
      '**/*.d.json.ts',
      '**/playwright-report/**/*',
      '**/test-results/**/*'
    ],
  },
  // Define regras principais e extensões herdadas
  ...compat.config({
    env: {
      browser: true, // Permite variáveis globais do navegador (window, document, etc)
      es2021: true, // Ativa recursos do ES2021 (como Optional Chaining, Nullish Coalescing)
      jest: true, // Suporte a globals do Jest em arquivos de teste
    },
    extends: [
      'next/core-web-vitals', // Regras focadas em performance para Next.js
      'next/typescript', // Suporte à integração Next + TypeScript
      // 'standard',                 // Comentado para evitar conflito com Prettier e TypeScript
      'plugin:@typescript-eslint/recommended', // Regras recomendadas para TypeScript
      'plugin:prettier/recommended', // Integração do Prettier com ESLint (desativa conflitos)
    ],
    parser: '@typescript-eslint/parser', // Parser do TypeScript
    parserOptions: {
      ecmaFeatures: {
        jsx: true, // Suporte a JSX
      },
      ecmaVersion: 'latest', // Permite uso de sintaxe moderna (ESNext)
      sourceType: 'module', // Interpreta arquivos como módulos ES
    },
    plugins: ['jsx-a11y', '@typescript-eslint'], // Plugins adicionais (acessibilidade e TS)
    rules: {
      quotes: [1, 'single'], // Prefere aspas simples com warning
      'prefer-arrow-callback': 1, // Sugere usar arrow functions em callbacks
      'prefer-template': ['error'], // Obriga uso de template strings no lugar de concatenação
      'no-mixed-requires': 'off', // Permite misturar `require` com `import`
      'object-shorthand': ['error', 'always'],
      camelcase: 'off', // Permite usar variáveis fora do padrão camelCase

      // Regras do TypeScript
      '@typescript-eslint/no-explicit-any': 0, // Permite uso de `any`
      '@typescript-eslint/no-unused-vars': [
        // Ignora variáveis iniciadas com `_`
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Regras React Hooks
      'react-hooks/exhaustive-deps': 'off', // Desativa verificação de deps do useEffect
      'react-hooks/rules-of-hooks': 0, // Desativa verificação de regras dos hooks

      // Regras React e acessibilidade
      'react/jsx-no-literals': 'error', // Não permite texto direto em JSX (exige `{ 'texto' }`)
      'react/no-unknown-property': 'error', // Previne atributos errados no JSX (ex: `class` ao invés de `className`)

      // Restrições de importação
      'no-restricted-imports': [
        'error',
        {
          name: 'next/link',
          message: 'Please import from `@/i18n/routing` instead.',
        },
        {
          name: 'next/navigation',
          importNames: ['redirect', 'permanentRedirect', 'useRouter', 'usePathname'],
          message: 'Please import from `@/i18n/routing` instead.',
        },
      ],

      // Regras Prettier (estilo de código + suporte a Tailwind)
      'prettier/prettier': [
        'error',
        {
          plugins: ['prettier-plugin-tailwindcss'], // Ordena classes do Tailwind automaticamente
          tailwindStylesheet: './src/app/globals.css',
          tailwindAttributes: ['class', 'className', '.*Styles.*'],
          tailwindFunctions: ['clsx', 'cva', 'cx'],
          printWidth: 120,
          tabWidth: 2,
          singleQuote: true,
          trailingComma: 'all',
          arrowParens: 'always',
          semi: false,
          endOfLine: 'auto',
        },
      ],

      // Regras de acessibilidade (jsx-a11y)
      'jsx-a11y/alt-text': [
        'warn',
        {
          elements: ['img'],
          img: ['Image'],
        },
      ],
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',

      // Regras import
      'import/no-duplicates': 'error', // força agrupamento
      // 'import/order': [
      //   'error',
      //   {
      //     groups: ['builtin', 'external', 'internal', ['type'], 'parent', 'sibling', 'index'],
      //     pathGroups: [
      //       {
      //         pattern: '@/**',
      //         group: 'internal',
      //       },
      //     ],
      //     pathGroupsExcludedImportTypes: ['builtin'],
      //     alphabetize: { order: 'asc', caseInsensitive: true },
      //     'newlines-between': 'always',
      //   },
      // ],
    },

    // Configurações de plugins
    settings: {
      react: {
        version: 'detect', // Detecta automaticamente a versão do React
      },
      'import/parsers': {
        [typescriptParser]: ['.ts', '.tsx', '.d.ts'], // Usa parser do TypeScript para esses arquivos
      },
    },
  }),
]

export default next
