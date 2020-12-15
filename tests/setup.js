import Vue from "vue";
import Vuetify from "vuetify";
import { config } from "@vue/test-utils"

// MOCK FUNCTIONS
config.mocks.$t = key => key;

Vue.use(Vuetify);
