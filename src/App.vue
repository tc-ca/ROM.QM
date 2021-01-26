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
          class="mx-auto"
        >
          <provision-search
            :clear-provision-search-text="clearProvisionSearchText"
            @set-clear-provision-search-false="setClearProvisionSearchFalse"
            @shrink-provision-search-field="shrinkProvisionSearchField"
          />
        </v-card>
      </v-expand-x-transition>
      <!-- PROVISION SEARCH FILTER -->
      <v-btn
        id=""
        icon
        color="white"
        @click="expandProvisionSearchField = !expandProvisionSearchField"
      >
        <v-icon> mdi-magnify </v-icon>
      </v-btn>
      <!-- CHRACTERISTIC FILTER -->
      <v-btn
        id=""
        icon
        color="white"
        @click="showCharacteristicFilter = !showCharacteristicFilter"
      >
        <v-badge
          v-if="siteCharacteristicsCount > 0"
          :content="siteCharacteristicsCount"
          :value="true"
          color="red"
          overlap
        >
          <v-icon> mdi-tune </v-icon>
        </v-badge>
      </v-btn>
    </v-app-bar>
    <settings
      :show="showSettings"
      @appsettings="settings"
      @close="showSettings = false"
    />
    <characteristic-filter
      :show="showCharacteristicFilter"
      @close-characteristic-filter-drawer="showCharacteristicFilter = false"
      @update-site-characteristic-count="updateCharacteristicCount"
    />
    <v-content>
      <v-container
        class="px-2"
      >
        <router-view
          ref="routerView"
          :expand-all-prop-questionnaire="expandAllQuestionnaire"
          :read-only-prop-questionnaire="readOnlyQuestionnaire"
          :validate-prop-questionnaire="validateQuestionnaire"
          :navigation-display-prop-questionnniare="displayNavigationQuestionnaire"
          :clear-prop-builder="clearBuilder"
          :save-prop-builder="saveBuilder"
          :fix-it-prop-builder="fixItBuilder"
          @clear-provision-search-field="setClearProvisionSearchTrue"
        />
      </v-container>
    </v-content>
    <notification-container />
    <legislation-search-modal
      :show-modal="showLegislationSearchModal"
      @hideModal="showLegislationSearchModal = false"
    />
    <div v-if="isQuestionnairePage">
      <bottom-navigation-questionnaire
        @expand-panels="expandAllQuestionnaire = !expandAllQuestionnaire"
        @scroll-to-top="scrollToTop"
        @validate="validateQuestionnaire = !validateQuestionnaire"
        @set-read-only="readOnlyQuestionnaire = !readOnlyQuestionnaire"
        @display-navigation=" displayNavigationQuestionnaire = ! displayNavigationQuestionnaire"
      />
    </div>
    <div v-else-if="isBuilderPage && envDev">
      <bottom-navigation-builder
        @clear="clearBuilder = !clearBuilder"
        @save="saveBuilder = !saveBuilder"
        @fix-it="fixItBuilder = !fixItBuilder"
      />
    </div>

    <!-- <div style="font-size: small; margin-left: 10px">
      <div v-if="envDev">
        Environment: {{ env }}
      </div>
      <div v-if="envDev">
        Load local data: {{ loadLocalData }}
      </div>
    </div> -->
  </v-app>
</template>

<script>
import { LANGUAGE } from './constants.js'
import NotificationContainer from './components/notification-container/notification-container.vue'
import LegislationSearchModal from './components/legislation-search-modal/legislation-search-modal.vue'
import ProvisionSearch from './components/provision-search/provision-search.vue'
import CharacteristicFilter from './components/filter/characteristic-filter/characteristic-filter.vue'
import BottomNavigationQuestionnaire from './components/bottom-navigation/bottom-navigation-questionnaire.vue'
import BottomNavigationBuilder from './components/bottom-navigation/bottom-navigation-builder.vue'

import Settings from './components/settings/settings.vue'
import BaseMixin from './mixins/base'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    NotificationContainer,
    LegislationSearchModal,
    Settings,
    ProvisionSearch,
    CharacteristicFilter,
    BottomNavigationQuestionnaire,
    BottomNavigationBuilder

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
    }
  },
  data: function () {
    return {
      // app related data
      showLegislationSearchModal: false,
      showSettings: false,
      expandProvisionSearchField: false,
      clearProvisionSearchText: false,
      showCharacteristicFilter: false,
      siteCharacteristicsCount: 0,
      // questionnaire related data that will be passed into the router specific component
      expandAllQuestionnaire: true,
      readOnlyQuestionnaire: false,
      validateQuestionnaire: false,
      displayNavigationQuestionnaire: false,
      // questionnaire related data that will be passed into the router specific component
      clearBuilder: false,
      saveBuilder: false,
      fixItBuilder: false
    }
  },
  computed: {
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
  updated () {
    console.log(JSON.stringify(this.$store.state.questionnaire.questionnaire))
  },
  methods: {
    ...mapActions(['setAppLanguage', 'setSettings']),
    setLanguage () {
      this.$i18n.locale = this.lang
      this.setAppLanguage(this.lang)
    },
    /**
     * Run the validation of the Questionnaire.
     */
    RunValidation () {
      this.validateQuestionnaire = true
    },
    VerifyValidation () {
      
    },
    /**
     * Sets the questionnaire read only property, which is used to allow modifications to the questionnaire.
     */
    SetReadOnly (readOnly) {
      this.$store.dispatch('setQuestionnaireReadOnlyStatus', readOnly)
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
    SetLegislations (legislations, dataStructure) {
      switch (dataStructure) {
        case 'tree':
          this.$store.dispatch('SetTreeLegislationsState', { legislations })
          break
        case 'flat':
          this.$store.dispatch('SetFlatLegislationsState', { legislations })
          break
        default:
          this.$store.dispatch('SetFlatLegislationsState', { legislations })
          break
      }
    },
    /**
    * Sets characteristics state
    */
    SetCharacteristics (characteristics) {
      this.$store.dispatch('SetCharacteristicsState', { characteristics })
    },
    updateCharacteristicCount (count) {
      this.siteCharacteristicsCount = count
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
</style>
