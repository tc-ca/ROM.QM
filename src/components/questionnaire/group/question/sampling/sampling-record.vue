<template>
  <div>
    <v-text-field
      v-model.number="samplingRecord.aproximateTotal"
      :label="$t('app.questionnaire.group.question.sampling.approximateTotal')"
      :hint="$t('app.questionnaire.group.question.sampling.approximateTotalPlaceholder')"
      clearable
      outlined
      type="number"
    />
    <v-text-field
      v-model.number="samplingRecord.sampleSize"
      :label="$t('app.questionnaire.group.question.sampling.sampleSize')"
      :hint="$t('app.questionnaire.group.question.sampling.sampleSizePlaceholder')"
      clearable
      outlined
      type="number"
    />
    <v-text-field
      v-model.number="samplingRecord.nonCompliances"
      :label="$t('app.questionnaire.group.question.sampling.nonCompliances')"
      :hint="$t('app.questionnaire.group.question.sampling.nonCompliancesPlaceholder')"
      clearable
      outlined
      type="number"
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
    },
    group: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      samplingRecord: {
        aproximateTotal: '',
        sampleSize: '',
        nonCompliances: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
