<template>
  <div>
    <questionnaire
      ref="questionnaire"
      @clear-provision-search-field="onClearProvisionSearchField"
    />
  </div>
</template>

<script>
import Questionnaire from '../components/questionnaire/questionnaire.vue'
import BaseMixin from '../mixins/base'

export default {
  emits: ['clear-provision-search-field'],

  components: {
    Questionnaire
  },
  mixins: [BaseMixin],
  async mounted () {
    if (this.loadLocalData) {
      await this.$store.dispatch('SetFlatLegislationsStateToLocalData')
    }
  },
  methods: {
    onClearProvisionSearchField () {
      this.$emit('clear-provision-search-field')
    }
  }
}
</script>

<style scoped>
</style>
