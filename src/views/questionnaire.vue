    <!-- 3 COLUMN GRID -->

<template>
  <div>
    <v-container>
      <v-row>
        <!-- <v-col
          cols="12"
          sm="2"
        >
          <v-sheet
            rounded="lg"
            min-height="268"
          >
            COLUMN 1
          </v-sheet>
        </v-col>-->

        <v-col
          cols="12"
          sm="8"
        >
          <!-- COLUMN 2  -->

          <v-sheet
            min-height="70vh"
            rounded="lg"
          >
            <questionnaire-answers
              ref="questionnaire"
              :expand-all-prop="expandPanels"
              :read-only-prop="readOnlyPropQuestionnaire"
              :validate-prop="validatePropQuestionnaire"
              :display-navigation-prop="navigationDisplayPropQuestionnniare"
              :notification:click="onNotificationClick"
              @clear-provision-search-field="onClearProvisionSearchField"
            />
            <questionnaire-error
              :is-visible="validate"
              @notification:click="onNotificationClick"
              @close="validate = false"
            />
            <questionnaire-nav
              :display="drawer"
              :navitems="navItems"
              @question:click="onQuestionClick"
              @navigation-close="drawer = $event"
            />
          </v-sheet>
        </v-col>

        <!-- <v-col
          cols="12"
          sm="2"
        >
          <v-sheet
            rounded="lg"
            min-height="268"
          >
            COLUMN 3
          </v-sheet>
        </v-col> -->
      </v-row>
    </v-container>
  </div>
</template>

<script>
import BuilderService from '../services/builderService'
import QuestionnaireAnswers from '../components/questionnaire/questionnaire-answers.vue'
import QuestionnaireError from '../components/questionnaire/questionnaire-error.vue'
import QuestionnaireNav from '../components/questionnaire-nav/questionnaire-nav.vue'

import BaseMixin from '../mixins/base'
import { mapState } from 'vuex'

export default {
  emits: ['clear-provision-search-field'],
  components: {
    QuestionnaireAnswers,
    QuestionnaireError,
    QuestionnaireNav
  },
  mixins: [BaseMixin],
  props: {
    expandAllPropQuestionnaire: {
      type: Object,
      required: true
    },
    collaspeAllPropQuestionnaire: {
      type: Boolean,
      default: false
    },
    validatePropQuestionnaire: {
      type: Boolean,
      default: false
    },
    readOnlyPropQuestionnaire: {
      type: Boolean,
      default: false
    },
    navigationDisplayPropQuestionnniare: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      validate: false,
      drawer: false,
      expandPanels: this.expandAllPropQuestionnaire,
      navItems: []

    }
  },
  computed: {
    ...mapState({
      lang: state => {
        if (!state || !state.settings) {
          return 'en'
        }
        return state.settings.settings.lang
      },
      group: state => {
        return state.group
      }
    })
  },
  watch: {
    validatePropQuestionnaire () {
      // set to true, as it represents user clicking on the button, opens drawer component
      this.validate = true
    },
    navigationDisplayPropQuestionnniare () {
      this.displayNavigationDrawer()
    }
  },

  async mounted () {
    // if env= dev and loadLocalData then set the questionnaire state to local copy else the state will be set explicility outside in app.vue
    if (this.envDev && this.loadLocalData && !this.$store.getters.getModifiedinBuilder) {
      var templateToLoad = process.env.VUE_APP_TEMPLATE_TO_LOAD
      const questionnaire = await BuilderService.GetMockQuestionnaireFromImportModule(templateToLoad)
      this.$store.dispatch('SetQuestionnaireState', { questionnaire, page: 'questionnaire' })
    }
    // if env= dev load the provisions else the state will be set explicility outside in app.vue
    if (this.envDev && this.loadLocalData) {
      await this.$store.dispatch('SetFlatLegislationsStateToLocalData')
      await this.$store.dispatch('SetCharacteristicsStateToLocalData')
    }
  },
  methods: {
    onClearProvisionSearchField () {
      this.$emit('clear-provision-search-field')
    },
    onNotificationClick (n) {
      this.$store.commit('errors/updateErrorNotification', n.qguid)
      this.validate = false
      this.expandPanels.value = true
    },
    onQuestionClick (q) {
      if (q.guid === undefined) return
      this.expandPanels.value = true
      this.drawer = false
      this.$store.commit('errors/updateErrorNotification', q.guid)
    },
    displayNavigationDrawer () {
      let a = JSON.stringify(this.$store.state.questionnaire.questionnaire.groups).replace(/\\"/g, '"')

      console.log('tttt', a)
      let b = a.replaceAll('primaryKey', 'id')
        .replaceAll('"questions":', '"children":')
        .replaceAll('"childQuestions":', '"children":')
        .replaceAll('"name":', '"name_o":')
        .replaceAll('"text":', '"name":')
        .replaceAll('"title":', '"name":')
      const regex = /("name":{"en":([^}]+)"fr":([^}]+)})/ig
      const regex1 = /("name":{"en":([^}]+)"fr":([^}]+)})/i

      let r = b.match(regex)
      r.forEach(i => {
        let en = '"name":' + i.match(/"en":"([^"]+)"/ig)[0].replaceAll('"en":', '')
        let fr = '"name":' + i.match(/"fr":"([^"]+)"/ig)[0].replaceAll('"fr":', '')
        b = b.replace(regex1, this.lang === 'en' ? en : fr)
      })
      this.$vuetify.goTo(0)
      this.navItems = JSON.parse(b)
      this.drawer = true
    }
  }
}
</script>

<style scoped>
</style>
