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
    hint="Find a question through provision"
    @keydown.enter="isMenuActive(false)"
    @input="updateProvisionFilter"
    @blur="shrinkProvisionSearchField"
  />
</template>

<script>
import { mapState } from 'vuex'

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
      provisions: []
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
    })
  },
  watch: {
    searchInput (value) {
      if (value) {
        this.provisions = this.searchableProvisions.filter(item => item.title[this.lang].toLowerCase().includes(value.toLowerCase()))
      }
    },
    clearProvisionSearchText (value, oldValue) {
      if (value) {
        this.searchInput = null
        this.$emit('set-clear-provision-search-false')
      }
    }
  },
  methods: {
    isMenuActive (value) {
      this.$refs.provisionSearch.isMenuActive = value
    },
    // note: combobox input always returns object if item is selected from list or string if something is inputted.
    updateProvisionFilter (value) {
      if (typeof value === 'object' && value !== null) {
        // item was selected from combobox list
        this.$store.dispatch('UpdateProvisionFilterState', { provisionFilter: [value] })
      } else if (value === null) {
        this.$store.dispatch('UpdateProvisionFilterState', { provisionFilter: null })
      } else if (typeof value === 'string') {
        if (value && !value.trim()) {
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
    shrinkProvisionSearchField () {
      if (this.provisions.length > 0) {
        this.$emit('shrink-provision-search-field')
      }
      if (this.model === null) {
        this.$emit('shrink-provision-search-field')
      }
      if (typeof this.model === 'string') {
        if (this.model && !this.model.trim()) {
          this.$emit('shrink-provision-search-field')
        }
      }
    }

  }

}
</script>

<style scoped>
</style>
