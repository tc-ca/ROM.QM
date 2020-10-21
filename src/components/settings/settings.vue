<template>
  <v-navigation-drawer v-model="showDrawer" temporary app>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          {{ $t('app.settings.settings') }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list dense nav>
      <v-list-item>
        <template>
          <v-list-item-icon>
            <v-icon>mdi-palette</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            {{
              $t('app.settings.darkMode')
            }}
          </v-list-item-content>
          <v-list-item-action>
            <v-switch
              v-model="darkMode"
              color="primary"
              @change="setDarkMode"
            />
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-list-item>
        <template>
          <v-list-item-content>
            <v-row no-gutters="">
              <v-col>
                <span>{{ $t("app.settings.language") }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-select
                  v-model="language"
                  dense
                  filled
                  :items="languages"
                  @change="setLanguage"
                />
              </v-col>
            </v-row>
          </v-list-item-content>
        </template>
      </v-list-item>
      <v-list-item v-if="displayNav" link @click="navigateTo('home')">
        <v-list-item-content>
          <v-list-item-title>
            Home
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="displayNav" link @click="navigateTo('questionnaire')">
        <v-list-item-content>
          <v-list-item-title>
            Questionnaire
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="displayNav" link @click="navigateTo('builder')">
        <v-list-item-content>
          <v-list-item-title>
            Builder
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="displayNav" link @click="loadDocumentationSafetyMarks()">
        <v-list-item-content>
          <v-list-item-title>
            Documentation and Safety Marks Example
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { LANGUAGES } from '../../config.js'
import questionnaireApi from '../../services/questionnaireService'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    appsettings: {
      type: Object,
      default: function () {
        return {
          lang: 'en-US',
          darkmode: true
        }
      }
    }
  },
  data () {
    return {
      language: null, // gets set in the created method
      darkMode: false,
      languages: LANGUAGES,
      displayNav: false
    }
  },
  computed: {
    ...mapGetters({ settings: 'settings' }),
    lang: state => {
      if (!state || !state.settings) {
        return 'en-US'
      }
      return state.settings.lang
    },
    showDrawer: {
      get () {
        return this.show
      },
      set (val) {
        if (!val) {
          this.$emit('close')
        }
      }
    }
  },
  created () {
    this.showDrawer = this.show
    if (this.appsettings) {
      this.darkMode = this.appsettings.darkMode
      this.$vuetify.theme.dark = this.appsettings.darkMode
      this.language = this.appsettings.lang
    }

    const env = process.env.NODE_ENV || 'development'

    if (env === 'development') {
      this.displayNav = true
    }
  },
  methods: {
    ...mapActions(['saveDarkMode', 'setAppLanguage', 'setQuestionnaire']),
    setDarkMode (val) {
      console.log('setDarkMode')
      this.$vuetify.theme.dark = val
      this.saveDarkMode(val)
    },
    setLanguage (val) {
      console.log('setLanguage')
      this.$i18n.locale = val
      this.setAppLanguage(val)
    },
    navigateTo (name, schema) {
      console.log(name)

      if (schema) {
        this.$router.push({ name: name, params: { schema: schema } }).catch(e => {
          console.log(e)
        })
      }

      this.$router.push({ name: name }).catch(e => {
        console.log(e)
      })
    },
    loadDocumentationSafetyMarks () {
      console.log('loadDocumentationSafetyMarks')
      let docSafetyMark = questionnaireApi.GetQuestionnaireGroups()
      this.$store.dispatch('setQuestionnaireGroups', docSafetyMark.groups)
      this.navigateTo('questionnaire')
    }
  }
}
</script>
