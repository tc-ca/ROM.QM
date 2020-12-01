import {addDecorator} from "@storybook/vue"
import { withA11Y } from "@storybook/addon-a11y";

import Vue from "vue"
//Note: import from vuetify (non tree shakeable) makes it more simple then from importing vuetify-lib which is proper way to load the components we use for production, but for storybook/dev environment not needed, avoids additional setup/avoid install Veutify loader webpack.
import Vuetify from "vuetify" 
import "vuetify/dist/vuetify.css"
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify, {
})
//note wraps stories in the v-app to properly display vuetify components
addDecorator(() => ({
  vuetify: new Vuetify({}),
  template: `<v-app><story/></v-app>`
}));


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}