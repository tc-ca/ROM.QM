module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-actions",
    "@storybook/addon-knobs",
    {
      name: "@storybook/addon-docs",
      options: {
        babelOptions: {
          presets: [
            [
              "@vue/cli-plugin-babel/preset",
              {
                jsx: false
              }
            ]
          ]
        }
      }
    }
  ]
};