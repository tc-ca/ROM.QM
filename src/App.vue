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
      <!-- PROVISION SEARCH FIELD -->
      <v-expand-x-transition v-if="isQuestionnairePage">
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

      <!-- PROVISION SEARCH FILTER BUTTON -->
      <v-btn
        v-if="isQuestionnairePage"
        id=""
        icon
        color="white"
        @click="expandProvisionSearchField = !expandProvisionSearchField"
      >
        <v-icon> mdi-magnify </v-icon>
      </v-btn>
      <!-- CHRACTERISTIC FILTER BUTTON -->
      <v-btn
        v-if="isQuestionnairePage"
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

        <v-icon v-if="siteCharacteristicsCount === 0">
          mdi-tune
        </v-icon>
      </v-btn>
      <!-- SAVE BUTTON -->
      <v-btn
        v-if="isQuestionnairePage"
        id=""
        icon
        color="white"
        @click="emitSaveEvent"
      >
        <v-icon> mdi-content-save </v-icon>
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
    <v-main>
      <v-container
        fluid
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
          :update-prop-builder="updateItBuilder"
          @clear-provision-search-field="setClearProvisionSearchTrue"
        />
      </v-container>
    </v-main>
    <notification-container />

    <div
      v-if="isQuestionnairePage"
    >
      <bottom-navigation-questionnaire
        :is-expand-panels="expandAllQuestionnaire"
        :is-read-only="readOnlyQuestionnaire"
        @expand-panels="expandAllQuestionnaire = expandAllQuestionnaire"
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
        @update-it="updateItBuilder = !updateItBuilder"
      />
    </div>
  </v-app>
</template>

<script>
import { LANGUAGE } from './constants.js'
import NotificationContainer from './components/notification-container/notification-container.vue'
import ProvisionSearch from './components/provision-search/provision-search.vue'
import CharacteristicFilter from './components/filter/characteristic-filter/characteristic-filter.vue'
import BottomNavigationQuestionnaire from './components/bottom-navigation/bottom-navigation-questionnaire.vue'
import BottomNavigationBuilder from './components/bottom-navigation/bottom-navigation-builder.vue'

import Settings from './components/settings/settings.vue'
import BaseMixin from './mixins/base'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'App',
  events: ['tdg-qstnnr-save'],
  components: {
    NotificationContainer,
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
    },
    userName: {
      type: String,
      default: ''
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
      expandAllQuestionnaire: { value: false },
      readOnlyQuestionnaire: false,
      validateQuestionnaire: false,
      displayNavigationQuestionnaire: false,
      // builder related data that will be passed into the router specific component
      clearBuilder: false,
      saveBuilder: false,
      fixItBuilder: false,
      isFormDirty: false,
      updateItBuilder: false
    }
  },
  computed: {
    ...mapState({
      language: (state) => {
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
    userName (value, oldValue) {
      this.setUserName(value)
    },
    settings (value, oldValue) {
      console.log('App.vue: settings watch ' + value)
      this.settings = JSON.parse(value)
    },
    isFormDirty (value, oldValue) {
      console.log('isFormDirty: ' + value)
      let event = new CustomEvent('tdg-qstnnr-updated', {
        detail: {
          message: 'Is Dirty Updated',
          isDirty: value
        },
        bubbles: true,
        cancelable: true
      })

      document.body.dispatchEvent(event)
    }
  },
  created: async function () {
    this.$router.push({ name: this.page }).catch((e) => {
      console.log(e)
    })
  },
  updated () {
    // console.log(JSON.stringify(this.$store.state.questionnaire.questionnaire))
  },
  methods: {
    ...mapActions(['setAppLanguage', 'setUserName', 'setSettings']),
    setLanguage () {
      this.$i18n.locale = this.lang
      this.setAppLanguage(this.lang)
    },
    setImageState (data) {
      this.$store.commit('imagefile/updateImageResult', data)
    },
    setImageBase64String (data) {
      this.$store.commit('imagefile/updateImageBase64String', data)
    },
    setDeletedImageState (data) {
      this.$store.commit('imagefile/deleteImageResult', data)
    },
    setFileState (data) {
      this.$store.commit('imagefile/updateFileResult', data)
    },
    setFileBase64String (data) {
      this.$store.commit('imagefile/updateFileBase64String', data)
    },
    setDeletedFileState (data) {
      this.$store.commit('imagefile/deleteFileResult', data)
    },
    emitSaveEvent () {
      if (this.isQuestionnaireDataAvailable) {
        const error = this.RunValidation()
        let event = new CustomEvent('tdg-qstnnr-save', {
          detail: {
            questionnaireJSON: this.$store.state.questionnaire.questionnaire,
            error: error
          },
          bubbles: true,
          cancelable: true
        })
        document.body.dispatchEvent(event)
      } else {
        console.log('questionnaire state is empty')
      }
    },
    RunValidation () {
      this.$store.dispatch('error/validateQuestions')
      const errors = this.$store.state.error.notifications
      return { isValid: !errors.length > 0, errorCount: errors.length }
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
    SetCharacteristics (data) {
      this.$store.dispatch('SetCharacteristicsState', data)
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
