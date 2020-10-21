<template>
  <v-app id="app">
    <v-app-bar
      app
      hide-on-scroll
      class="primary white--text"
    >
      <v-app-bar-nav-icon
        color="white"
        @click="showSettings = !showSettings"
      />
      <v-toolbar-title>
        {{ questionnaire.title[lang] }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        id="save"
        icon
        color="white"
        data-qtn-id="save"
        @click="save()"
      >
        <v-icon data-qtn-id="save">
          mdi-content-save
        </v-icon>
      </v-btn>
      <v-btn
        icon
        color="white"
        @click="showLegislationSearchModal = true"
      >
        <v-icon>mdi-database-search</v-icon>
      </v-btn>
    </v-app-bar>
    <settings
      :show="showSettings"
      @appsettings="settings"
      @close="showSettings = false"
    />
    <v-content>
      <v-container class="px-2">
        <router-view />
      </v-container>
    </v-content>
    <notification-container />
    <legislation-search-modal
      :show-modal="showLegislationSearchModal"
      @hideModal="showLegislationSearchModal = false"
    />
  </v-app>
</template>

<script>
import { LANGUAGE } from './constants.js'

import NotificationContainer from './components/notification-container/notification-container.vue'
import LegislationSearchModal from './components/legislation-search-modal/legislation-search-modal.vue'
import Settings from './components/settings/settings.vue'
import { mapActions, mapState } from 'vuex'
import builderService from './services/builderService.js'

export default {
  name: 'App',
  components: {
    NotificationContainer,
    LegislationSearchModal,
    Settings
  },
  props: {
    page: {
      type: String,
      required: true
    },
    lang: {
      type: String,
      default: LANGUAGE.ENGLISH
    }
  },
  data: function () {
    return {
      showLegislationSearchModal: false,
      showSettings: false
    }
  },
  computed: {
    title () {
      return `${this.questionnaire.title[this.language]}`
    },
    ...mapState({
      language: state => {
        console.log('App.vue: language computed ' + state + ')')
        if (state == null || !state.settings) {
          return LANGUAGE.ENGLISH
        }
        return state.settings.settings.lang
      },
      questionnaire: state => {
        console.log('App.vue: questionnaire computed ' + state + ')')
        if (!state || !state.app) {
          return builderService.createQuestionnaire()
        }
        return state.settings.questionnaire
      },
      settings: state => {
        if (state == null || !state.settings) {
          return {
            lang: LANGUAGE.ENGLISH,
            darkMode: false
          }
        }
        return state.settings.settings
      }
    })
  },
  watch: {
    // required for Field Service, as this.lang not available from the created hook method ONLY when app is reading code from tdgwoodservice.js, has to do with how the page is loaded in.
    lang (value, oldValue) {
      console.log('App.vue: lang watch ' + value + ')')
      this.setLanguage()
    },
    settings (value, oldValue) {
      console.log('App.vue: settings watch ' + value)
      this.settings = JSON.parse(value)
    }
  },
  created: function () {
    this.$router.push({ name: this.page }).catch(e => {
      console.log(e)
    })
  },
  methods: {
    ...mapActions([ 'setAppLanguage', 'setSettings' ]),
    setLanguage () {
      console.log('App.vue: setLanguage (' + this.lang + ')')
      this.$i18n.locale = this.lang
      this.setAppLanguage(this.lang)
    },
    save () {
      this.setSettings(this.settings)
    }
  }

}
</script>

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}

</style>
