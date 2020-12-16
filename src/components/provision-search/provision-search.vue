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
  />
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'QuestionnaireSearch',
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
      } else {
        this.provisions = []
        this.$store.dispatch('UpdateProvisionFilterState', { provisionFilter: [] })
      }
    }
  },
  methods: {
    isMenuActive (value) {
      this.$refs.provisionSearch.isMenuActive = value
    },
    updateProvisionFilter (value) {
      // object means the item was selected from combobox list else a string will be returned if the user types something not in the list.
      if (typeof value === 'object' && value !== null) {
        this.$store.dispatch('UpdateProvisionFilterState', { provisionFilter: [value] })
      } else if (value === null) {
        // set to empty array
        this.$store.dispatch('UpdateProvisionFilterState', { provisionFilter: [] })
      } else {
        // in this case of string its a generic search, and pass all the provisions found while filtering
        this.$store.dispatch('UpdateProvisionFilterState', { provisionFilter: this.provisions })
      }
    }

  }

}
</script>

<style scoped>
</style>
