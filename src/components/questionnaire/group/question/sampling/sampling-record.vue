<template>
  <div>
    <v-text-field
      v-model.number="question.samplingRecord.aproximateTotal"
      :label="$t('app.questionnaire.group.question.sampling.approximateTotal')"
      :hint="$t('app.questionnaire.group.question.sampling.approximateTotalPlaceholder')"
      clearable
      outlined
      type="number"
      :error-messages="errorMessagesTotal"
      :rules="[validateSampling]"
    />
    <v-text-field
      v-model.number="question.samplingRecord.sampleSize"
      :label="$t('app.questionnaire.group.question.sampling.sampleSize')"
      :hint="$t('app.questionnaire.group.question.sampling.sampleSizePlaceholder')"
      clearable
      outlined
      type="number"
      :error-messages="errorMessagesSize"
      :rules="[validateSampling]"
    />
    <v-text-field
      v-model.number="question.samplingRecord.nonCompliances"
      :label="$t('app.questionnaire.group.question.sampling.nonCompliances')"
      :hint="$t('app.questionnaire.group.question.sampling.nonCompliancesPlaceholder')"
      clearable
      outlined
      type="number"
      :error-messages="errorMessagesCompliances"
      :rules="[validateSampling]"
    />
  </div>
</template>

<script>
export default {
  name: 'SamplingRecord',
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      errorMessagesTotal: '',
      errorMessagesSize: '',
      errorMessagesCompliances: ''
    }
  },
  computed: {
    isAnyError () {
      if (this.errorMessagesTotal.trim().length > 0) return true
      if (this.errorMessagesSize.trim().length > 0) return true
      if (this.errorMessagesCompliances.trim().length > 0) return true
      return false
    }
  },
  created () {
    if (!this.question.samplingRecord) {
      this.question.samplingRecord = {
        aproximateTotal: '',
        sampleSize: '',
        nonCompliances: ''
      }
    }
  },
  methods: {
    validateSampling () {
      this.errorMessagesTotal = ''
      this.errorMessagesSize = ''
      this.errorMessagesCompliances = ''
      if (this.question.samplingRecord.aproximateTotal < 0) {
        this.errorMessagesTotal = 'Error message < 0'
      }
      if (this.question.samplingRecord.sampleSize < 0) {
        this.errorMessagesSize = 'Error message < 0'
      }
      if (this.question.samplingRecord.nonCompliances < 0) {
        this.errorMessagesCompliances = 'Error message < 0'
      }
    }
  }
}
</script>

<style scoped>

</style>
