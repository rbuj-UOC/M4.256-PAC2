#!/bin/bash
PROJECT_NAME=frontend

# create the projecte
npx @angular/cli@latest new ${PROJECT_NAME} --no-strict --standalone=false --style=scss --ssr=no --skip-tests --package-manager="npm"

# install the packages
cd ${PROJECT_NAME}
ng add @angular-eslint/schematics --defaults --skip-confirmation
npm install --save-dev prettier prettier-eslint eslint-config-prettier eslint-plugin-prettier

ng add @ngrx/store --defaults --skip-confirmation
ng add @ngrx/effects --defaults --skip-confirmation
ng add @ngrx/eslint-plugin --defaults --skip-confirmation
rm -f .eslintrc.json
ng add @ngrx/store-devtools --defaults --skip-confirmation

# overwrite / create config files
cat << EOF > eslint.config.js
// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const ngrx = require('@ngrx/eslint-plugin/v9');

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      ...ngrx.configs.all,
      eslintPluginPrettierRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
EOF
cat << EOF > .prettierrc.json
{
  "trailingComma": "none",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
EOF

# generate components
