<template>
  <v-combobox
    ref="provisionSearch"
    v-model="model"
    hide-details
    clearable
    dense
    filled
    :items="provisions"
    :search-input.sync="searchInput"
    :item-text="'title.' + lang"
    item-key="id"
    :placeholder="$t('app.questionnaire.provisionSearchFilter.placeholder')"
    prepend-inner-icon="mdi-magnify"
    @keydown.enter="isMenuActive(false)"
    @keyup="debouncedUpdateProvisionFilter($event.target.value)"
    @blur="shrinkProvisionSearchField($event.target.value)"
  />
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'QuestionnaireSearch',
  emits: ['set-clear-provision-search-false', 'shrink-provision-search-field'],

  props: {
    clearProvisionSearchText: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      searchInput: null,
      model: null,
      provisions: [],
      debouncedUpdateProvisionFilter: _.throttle(this.updateProvisionFilter, 800)

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
      searchableProvisions: state => {
        if ((state.questionnaire.questionnaire === null) || (state.legislations.legislations === null)) {
          return []
        }
        const searchableProvisions = state.questionnaire.questionnaire.searchableProvisions
        let dictionnairyOfProvisions = state.legislations.legislations
        let provisions = []

        searchableProvisions.forEach(x => {
          const hydratedItem = dictionnairyOfProvisions[x.leg]
          const newProvision = { ...x, ...hydratedItem }
          provisions.push(newProvision)
        })

        return provisions
      }
    }),
    exampleText () {
      if (this.lang === 'en') {
        return 'For example search by provision label or text (Example: "3.5 (1) (c)")'
      }
      return 'Par exemple, recherchez par libellé ou texte de disposition (Exemple: "3.5 (1) (c)")'
    }
  },
  watch: {
    searchInput (value) {
      if (value) {
        const exampleHeader = [{ header: this.$t('app.questionnaire.provisionSearchFilter.exampleText'), questions: [] }]
        this.provisions = exampleHeader.concat(this.searchableProvisions.filter(item => item.title[this.lang].toLowerCase().includes(value.toLowerCase())))
      }
    },
    clearProvisionSearchText (value, oldValue) {
      if (value) {
        this.searchInput = ''
        this.$store.dispatch('UpdateProvisionFilterState', { provisionFilter: null })
        this.shrinkProvisionSearchField('')
        this.$emit('set-clear-provision-search-false')
      }
    }
  },
  mounted () {
    this.provisions = [{ header: this.$t('app.questionnaire.provisionSearchFilter.exampleText') }]
  },
  methods: {
    isMenuActive (value) {
      this.$refs.provisionSearch.isMenuActive = value
    },
    // note: combobox input always returns object if item is selected from list or string if something is inputted.
    updateProvisionFilter  (value) {
      if (typeof value === 'object' && value !== null) {
        // item was selected from combobox list
        this.$store.dispatch('UpdateProvisionFilterState', { provisionFilter: [value] })
      } else if (value === null) {
        this.$store.dispatch('UpdateProvisionFilterState', { provisionFilter: null })
      } else if (typeof value === 'string') {
        if (_.isEmpty(value.trim())) {
          // blank input
        // as the user has not really inputted anything i.e blank search so we wont filter and to do that we must set provision filter to null
          this.$store.dispatch('UpdateProvisionFilterState', { provisionFilter: null })
        } else {
          // typed in search
        // in this case of string its a generic search, and pass all the provisions found while filtering
          this.$store.dispatch('UpdateProvisionFilterState', { provisionFilter: this.provisions })
        }
      }
    },
    shrinkProvisionSearchField (value) {
      // if empty string hide
      if (_.isEmpty(value.trim())) {
        this.$emit('shrink-provision-search-field')
      }
    }

  }

}
</script>

<style scoped>
</style>
