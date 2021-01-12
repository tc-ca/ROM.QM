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
    <div style="font-size: small; margin-left: 10px">
      <div v-if="envDev">
        Environment: {{ env }}
      </div>
      <div v-if="envDev">
        Load local data: {{ loadLocalData }}
      </div>
    </div>
    <div>
      <v-btn
        v-show="fab"
        v-scroll="onScroll"
        class="btnTop"
        fab
        dark
        fixed
        bottom
        right
        color="warning"
        @click="scrollToTop"
      >
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </div>
  </v-app>
</template>

<script>
import { LANGUAGE } from './constants.js'
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
      fab: false,
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
    this.$router.push({ name: this.page }).catch((e) => {
      console.log(e)
    })
  },
  methods: {
    ...mapActions(['setAppLanguage', 'setSettings']),
    setLanguage () {
      this.$i18n.locale = this.lang
      this.setAppLanguage(this.lang)
    },
    /**
     * Sets the questionnaire read only property, which is used to allow modifications to the questionnaire.
     */
    SetReadOnly (readOnly) {
      const q = this.$store.getters['getQuestionnaire']
      if (q) {
        alert('LM: Doing the ReadOnly function')
        q.readOnly = readOnly
        this.$store.dispatch('setQuestionnaireReadOnlyStatus', q.readOnly)
      }
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
    },
    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 20
    },
    scrollToTop () {
      this.$vuetify.goTo(0)
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
.btnTop i:hover{
  transform: scale(1.80);
}
</style>
