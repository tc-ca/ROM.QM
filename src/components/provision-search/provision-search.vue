<template>
  <div>
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
      :filter="filters"
      @keyup="runUpdateProvisionFilter($event)"
      @blur="shrinkProvisionSearchField($event.target.value)"
      @click:clear="clear(true)"
      @input="updateProvisionFilter(model)"
    >
      <template v-slot:item="{ item }">
        <div>
          <div>
            <!-- eslint-disable vue/no-v-html -->
            <span
              class=""
              v-html="genFilteredText(item.title[lang])"
            />
          </div>
        </div>
      </template>
    </v-combobox>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import { escapeHTML } from '../../utils.js'

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
      debouncedUpdateProvisionFilter: _.debounce(this.updateProvisionFilter, 800, { 'leading': false,
        'trailing': true })
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
        this.provisions = this.searchableProvisions.filter(item => {
          const text = this.regexReplaceFaultyEmptySpaces(item.title[this.lang])
          const match = text.toLowerCase().match(this.regexSearchPattern(value))
          return match
        })
      }
    },
    clearProvisionSearchText (value, oldValue) {
      this.clear(value)
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
    },
    clear (value) {
      if (value) {
        this.searchInput = ''
        this.$store.dispatch('UpdateProvisionFilterState', { provisionFilter: null })
        this.shrinkProvisionSearchField('')
        this.$emit('set-clear-provision-search-false')
        this.$refs.provisionSearch.isMenuActive = false
      }
    },
    filters (item, queryText) {
      const text = this.regexReplaceFaultyEmptySpaces(item.title[this.lang])
      const itemsFound = text.toLowerCase().match(this.regexSearchPattern(queryText)
      )
      return Boolean(itemsFound)
    },
    genFilteredText (text) {
      text = text || ''

      if (!this.searchInput) return escapeHTML(text)

      return this.getMaskedCharacters(text)
    },
    genHighlight (text) {
      return `<span class="v-list-item__mask">${escapeHTML(text)}</span>`
    },
    getMaskedCharacters (text) {
      text = this.regexReplaceFaultyEmptySpaces(text)
      const queryText = (this.searchInput || '').toString()

      // var t = 0
      text = text.replace(this.regexSearchPattern(queryText), (match) => {
        // t++
        return this.genHighlight(match)
      })
      return text
    },
    // regex search pattern use to search
    regexSearchPattern (query) {
      const queryText = (query || '').toString()
      const regexSearchPattern = '(' + queryText + ')'
      return new RegExp(regexSearchPattern, 'gi')
    },
    // fix up any white space issues, some of the data have space but visually but not recongized something to do with char number??
    regexReplaceFaultyEmptySpaces (text) {
      const regexWhiteSpace = /\s/g
      return text.replace(regexWhiteSpace, ' ')
    },
    runUpdateProvisionFilter (event) {
      if (event.code === 'Enter') {
        this.updateProvisionFilter(this.model)
        this.isMenuActive(false)
      } else if (event.code !== 'ArrowDown' && event.code !== 'ArrowUp') { // do not need to execute query when moving up and down drop down menu list of items
        this.debouncedUpdateProvisionFilter(event.target.value)
      }
    }
  }

}
</script>

<style scoped>
</style>
