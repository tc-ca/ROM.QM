<template>
  <v-app
    id="app"
  >
    <v-app-bar
      app
      hide-on-scroll
      class="primary white--text"
    >
      <v-app-bar-nav-icon
        color="white"
        @click="showSettings = !showSettings"
      />
      <v-spacer />

      <v-expand-x-transition>
        <v-card
          v-show="expandProvisionSearchField"
          width="80%"
          class="mx-auto "
        >
          <provision-search
            :clear-provision-search-text="clearProvisionSearchText"
            @set-clear-provision-search-false="setClearProvisionSearchFalse"
            @shrink-provision-search-field="shrinkProvisionSearchField"
          />
        </v-card>
      </v-expand-x-transition>

      <v-btn
        id=""
        icon
        color="white"
        @click="expandProvisionSearchField = !expandProvisionSearchField"
      >
        <v-icon>
          mdi-magnify
        </v-icon>
      </v-btn>
    </v-app-bar>
    <settings
      :show="showSettings"
      @appsettings="settings"
      @close="showSettings = false"
    />
    <v-content>
      <v-container
        class="px-2"
      >
        <router-view
          ref="routerView"
          @clear-provision-search-field="setClearProvisionSearchTrue"
        />
      </v-container>
    </v-content>
    <notification-container />
    <legislation-search-modal
      :show-modal="showLegislationSearchModal"
      @hideModal="showLegislationSearchModal = false"
    />
    <div v-if="envDev">
      environment: {{ env }}
    </div>
    <div v-if="envDev">
      load local data: {{ loadLocalData }}
    </div>
  </v-app>
</template>

<script>
import { LANGUAGE } from './constants.js'
import BuilderService from './services/builderService'
import NotificationContainer from './components/notification-container/notification-container.vue'
import LegislationSearchModal from './components/legislation-search-modal/legislation-search-modal.vue'
import ProvisionSearch from './components/provision-search/provision-search.vue'

import Settings from './components/settings/settings.vue'
import BaseMixin from './mixins/base'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    NotificationContainer,
    LegislationSearchModal,
    Settings,
    ProvisionSearch
  },
  mixins: [BaseMixin],
  props: {
    page: {
      type: String,
      required: true
    },
    lang: {
      type: String,
      default: LANGUAGE.ENGLISH
    },
    templatejson: {
      type: String,
      default: 'Documentation and Safety Marks',
      required: false
    },
    templateid: {
      type: String,
      default: '',
      required: false
    }
  },
  data: function () {
    return {
      showLegislationSearchModal: false,
      showSettings: false,
      expandProvisionSearchField: false,
      clearProvisionSearchText: false
    }
  },
  computed: {
    title () {
      // This is a test for checkin using Github Desktop
      return `${this.questionnaire.title[this.language]}`
    },
    ...mapState({
      language: (state) => {
        console.log('App.vue: language computed ' + state + ')')
        if (state == null || !state.settings) {
          return LANGUAGE.ENGLISH
        }
        return state.settings.settings.lang
      },
      settings: (state) => {
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
  created: async function () {
    const page = this.page
    if (this.envDev && this.loadLocalData) {
      const questionnaire = await BuilderService.GetMockQuestionnaireFromImportModule()
      this.$store.dispatch('SetQuestionnaireState', { questionnaire, page })
    } else if (this.envDev && !this.loadLocalData) {
      const questionnaire = BuilderService.createQuestionnaire()
      this.$store.dispatch('SetQuestionnaireState', { questionnaire, page })
      await this.$store.dispatch('SetTreeLegislationsStateToLocalData')
    }

    this.$router.push({ name: this.page }).catch((e) => {
      // console.log(e)
    })
  },
  methods: {
    ...mapActions(['setAppLanguage', 'setSettings']),
    setLanguage () {
      this.$i18n.locale = this.lang
      this.setAppLanguage(this.lang)
    },
    /**
     * Sets the questionnaire state, which is used to render the on screen elements, a valid json must be passed.
     */
    Render (questionnaire) {
      const page = this.page
      if (questionnaire) {
        this.$store.dispatch('SetQuestionnaireState', { questionnaire, page })
      }
    },
    /**
    * Returns current state of questionnaire
    */
    GetState () {
      this.$store.dispatch('RemoveBuilderCircularDependencies')
      return this.$store.state.questionnaire.questionnaire
    },
    /**
    * Sets legislations state
    */
    SetLegislations (legislations) {
      this.$store.dispatch('SetLegislationsState', { legislations })
    },
    checkIsDirty () {
      if (this.$route.name === 'questionnaire') return this.$refs.routerView.$refs.questionnaire.isDirty()
      else if (this.$route.name === 'builder') return this.$refs.routerView.isDirty()
    },
    setClearProvisionSearchTrue () {
      this.clearProvisionSearchText = true
    },
    setClearProvisionSearchFalse () {
      this.clearProvisionSearchText = false
    },
    shrinkProvisionSearchField () {
      this.expandProvisionSearchField = false
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
