<template>
  <v-container>
    <v-row
      justify="space-around"
    >
      <span>Sampling Record</span>
    </v-row>
    <v-row
      no-gutters
      dense
      justify="center"
    >
      <v-col md="10">
        <v-text-field
          ref="question.samplingRecord.approximateTotal"
          v-model.number="question.samplingRecord.approximateTotal"
          :label="$t('app.questionnaire.group.question.sampling.approximateTotal')"
          :hint="$t('app.questionnaire.group.question.sampling.approximateTotalPlaceholder')"
          clearable
          outlined
          dense
          type="number"
          min="1"
          :error-messages="errorMessagesTotal"
          :rules="[ (value) => !!value || $t('app.questionnaire.group.question.sampling.EM_ApproximateTotalRequired'),
                    (value) => value && value > 0 || $t('app.questionnaire.group.question.sampling.EM_ApproximateTotalGreaterThan1'),
                    validateNumbers
          ]"
        />
      </v-col>
    </v-row>
    <v-row
      no-gutters
      dense
      justify="center"
    >
      <v-col md="10">
        <v-text-field
          ref="question.samplingRecord.sampleSize"
          v-model.number="question.samplingRecord.sampleSize"
          :label="$t('app.questionnaire.group.question.sampling.sampleSize')"
          :hint="$t('app.questionnaire.group.question.sampling.sampleSizePlaceholder')"
          clearable
          outlined
          dense
          type="number"
          min="1"
          :max="question.samplingRecord.approximateTotal"
          :error-messages="errorMessagesSize"
          :rules="[ (value) => !!value || $t('app.questionnaire.group.question.sampling.EM_SampleSizeRequired'),
                    (value) => value && value > 0 || $t('app.questionnaire.group.question.sampling.EM_SampleSizeGreaterThan1'),
                    validateNumbers
          ]"
        />
      </v-col>
    </v-row>
    <v-row
      no-gutters
      dense
      justify="center"
    >
      <v-col md="10">
        <v-text-field
          ref="question.samplingRecord.nonCompliances"
          v-model.number="question.samplingRecord.nonCompliances"
          :label="$t('app.questionnaire.group.question.sampling.nonCompliances')"
          :hint="$t('app.questionnaire.group.question.sampling.nonCompliancesPlaceholder')"
          clearable
          outlined
          dense
          type="number"
          min="0"
          :max="question.samplingRecord.sampleSize"
          :error-messages="errorMessagesCompliances"
          :rules="[ (value) => !!value || $t('app.questionnaire.group.question.sampling.EM_NonComplianceRequired'),
                    (value) => value && value >= 0 || $t('app.questionnaire.group.question.sampling.EM_NonComplianceGreaterPositive'),
                    validateNumbers
          ]"
        />
      </v-col>
    </v-row>
  </v-container>
  <!-- <div>
    <v-text-field
      ref="question.samplingRecord.approximateTotal"
      v-model.number="question.samplingRecord.approximateTotal"
      :label="$t('app.questionnaire.group.question.sampling.approximateTotal')"
      :hint="$t('app.questionnaire.group.question.sampling.approximateTotalPlaceholder')"
      clearable
      outlined
      dense
      type="number"
      min="1"
      :error-messages="errorMessagesTotal"
      :rules="[ (value) => !!value || $t('app.questionnaire.group.question.sampling.EM_ApproximateTotalRequired'),
                (value) => value && value > 0 || $t('app.questionnaire.group.question.sampling.EM_ApproximateTotalGreaterThan1'),
                validateNumbers
      ]"
    />
    <v-text-field
      ref="question.samplingRecord.sampleSize"
      v-model.number="question.samplingRecord.sampleSize"
      :label="$t('app.questionnaire.group.question.sampling.sampleSize')"
      :hint="$t('app.questionnaire.group.question.sampling.sampleSizePlaceholder')"
      clearable
      outlined
      dense
      type="number"
      min="1"
      :max="question.samplingRecord.approximateTotal"
      :error-messages="errorMessagesSize"
      :rules="[ (value) => !!value || $t('app.questionnaire.group.question.sampling.EM_SampleSizeRequired'),
                (value) => value && value > 0 || $t('app.questionnaire.group.question.sampling.EM_SampleSizeGreaterThan1'),
                validateNumbers
      ]"
    />
    <v-text-field
      ref="question.samplingRecord.nonCompliances"
      v-model.number="question.samplingRecord.nonCompliances"
      :label="$t('app.questionnaire.group.question.sampling.nonCompliances')"
      :hint="$t('app.questionnaire.group.question.sampling.nonCompliancesPlaceholder')"
      clearable
      outlined
      dense
      type="number"
      min="0"
      :max="question.samplingRecord.sampleSize"
      :error-messages="errorMessagesCompliances"
      :rules="[ (value) => !!value || $t('app.questionnaire.group.question.sampling.EM_NonComplianceRequired'),
                (value) => value && value >= 0 || $t('app.questionnaire.group.question.sampling.EM_NonComplianceGreaterPositive'),
                validateNumbers
      ]"
    />
  </div> -->
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
        approximateTotal: '',
        sampleSize: '',
        nonCompliances: ''
      }
    }
  },
  methods: {
    validateNumbers () {
      this.errorMessagesTotal = ''
      this.errorMessagesSize = ''
      this.errorMessagesCompliances = ''

      if (this.question.samplingRecord.approximateTotal === '' &&
          this.question.samplingRecord.sampleSize === '' &&
          this.question.samplingRecord.nonCompliances === '') {
        return true
      }

      if (this.question.samplingRecord.approximateTotal > 1 && this.question.samplingRecord.sampleSize > 1) {
        if (this.question.samplingRecord.approximateTotal < this.question.samplingRecord.sampleSize) {
          this.errorMessagesTotal = 'Approximate Total have to be higher than Sample Size'
          return false
        }
      }

      if (this.question.samplingRecord.sampleSize > 1 && this.question.samplingRecord.nonCompliances > 0) {
        if (this.question.samplingRecord.sampleSize < this.question.samplingRecord.nonCompliances) {
          this.errorMessagesSize = 'Sample Size have to be higher than Number of non-Compliance'
          return false
        }
      }

      return true
    }
  }
}
</script>

<style scoped>

</style>
