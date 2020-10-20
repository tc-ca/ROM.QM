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
        {{ app.settings.questionnaire.title[lang] }}
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
      @appsettings="app"
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
    metadata: {
      type: Object,
      default: function () {
        return {
          title: {
            [LANGUAGE.ENGLISH]: 'General Questionnaire',
            [LANGUAGE.FRENCH]: 'FR General Questionnaire'
          }
        }
      }
    },
    lang: {
      type: String,
      default: 'en-US'
    }
  },
  data: function () {
    return {
      showLegislationSearchModal: false,
      showSettings: false,
      meta: {
        title: ''
      },
      app: {
        settings: {
          questionnaire: {
            title: {
              [LANGUAGE.ENGLISH]: 'General Questionnaire',
              [LANGUAGE.FRENCH]: 'FR General Questionnaire'
            },
            groups: {},
            lang: 'en-US'
          }
        }
      }
    }
  },
  computed: {
    title () {
      return `${this.meta.title[this.language]}`
    },
    ...mapState({
      language: state => {
        console.log('App.vue: language computed ' + state + ')')
        if (state == null || !state.app) {
          return ''
        }
        return state.app.settings.lang
      },
      questionnaire: state => {
        console.log('App.vue: questionnaire computed ' + state + ')')
        if (state == null) {
          return {}
        }
        if (!state.app) {
          return {}
        }
        return state.app.settings.questionnaire
      },
      settings: state => {
        if (state == null || !state.app) {
          return { lang: 'en-US', questionnaire: { title: 'default title', groups: {}, lang: 'en-US' } }
        }
        return state.app.settings
      }
    })
  },
  watch: {
    // required for Field Service, as this.lang not available from the created hook method ONLY when app is reading code from tdgwoodservice.js, has to do with how the page is loaded in.
    lang (value, oldValue) {
      console.log('App.vue: lang watch ' + value + ')')
      this.setLanguage()
    },
    // settings (value, oldValue) {
    //   console.log('App.vue: settings watch ' + value)
    //   this.settings = JSON.parse(value)
    // },
    metadata (value, oldValue) {
      this.meta = JSON.parse(this.metadata)
    }
  },
  created: function () {
    this.$router.push({ name: this.page }).catch(e => { })
    this.meta = this.metadata
    this.getSettings()
  },
  methods: {
    ...mapActions(['getSettings', 'setAppLanguage', 'setSettings']),
    setLanguage () {
      console.log('App.vue: setLanguage (' + this.lang + ')')
      this.$i18n.locale = this.lang
      this.setAppLanguage(this.lang)
    },
    save () {
      this.setSettings(this.app.settings)
    },
    getSettings () {
      console.log('App.vue: setLanguage (' + this.lang + ')')
      this.$i18n.locale = this.lang
      this.setAppLanguage(this.lang)
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
