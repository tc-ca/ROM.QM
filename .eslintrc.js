module.exports = {
  root: true,

  env: {
    node: true,
    "browser": true
  },

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },

  parser: "babel-eslint",
  extends: ["eslint:recommended"],
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      extends: ["@vue/standard"],

      env: {
        jest: true
      }
    },
    {
      files: ["*.vue"],
      extends: ["plugin:vue/recommended", "@vue/standard"],
      rules: {
        "vue/component-name-in-template-casing": [
          "error",
          "kebab-case",
          {
            registeredComponentsOnly: false,
            ignores: []
          }
        ]
      }
    },

    {
      files: ["*.mdx"],
      extends: ["plugin:mdx/recommended", "plugin:react/recommended"],
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      },
      settings: {
        react: {
          version: "detect"
        }
      }
    }
  ]
};
