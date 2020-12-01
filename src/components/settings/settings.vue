<template>
  <v-navigation-drawer
    v-model="showDrawer"
    temporary
    app
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          {{ $t('app.settings.settings') }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list
      dense
      nav
    >
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
      <v-list-item
        v-if="displaynav"
        link
        @click="navigateTo('home')"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ $t('app.navigations.home') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-if="displaynav"
        link
        @click="navigateTo('questionnaire')"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ $t('app.navigations.questionnaire') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-if="displaynav"
        link
        @click="navigateTo('builder')"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ $t('app.navigations.builder') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-if="displaynav"
        link
        @click="getQuestionnaireFromDynamics()"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ $t('app.navigations.qFromDynamics') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-if="displaynav"
        link
        @click="navigateTo('questionnaire')"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ $t('app.navigations.qFromState') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { LANGUAGES } from '../../config.js'
// import { XrmWebApi } from '../../services/questionnaireService.js'

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
          lang: 'en',
          darkmode: true
        }
      }
    },
    displaynav: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      language: null, // gets set in the created method
      darkMode: false,
      languages: LANGUAGES
    }
  },
  computed: {
    ...mapGetters({ settings: 'settings' }),
    lang: state => {
      if (!state || !state.settings) {
        return 'en'
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
      this.displaynav = true
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
    navigateTo (name, templatejson) {
      console.log(name)
      if (templatejson) {
        this.$router.push({ name: name, params: { templatejson: templatejson } }).catch(e => {
          console.log(e)
        })
      }

      this.$router.push({ name: name }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>
