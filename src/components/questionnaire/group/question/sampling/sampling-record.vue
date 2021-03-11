<template>
  <v-sheet>
    <v-row
      no-gutters
    >
      <v-col>
        <span style="color:#757575">
          {{ $t('app.questionnaire.group.question.sampling.title') }}
        </span>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      dense
    >
      <v-col cols="4">
        <v-text-field
          ref="question.samplingRecord.approximateTotal"
          v-model.number="question.samplingRecord.approximateTotal"
          filled
          outlined
          :label="$t('app.questionnaire.group.question.sampling.approximateTotal')"
          :hint="$t('app.questionnaire.group.question.sampling.approximateTotalPlaceholder')"
          prepend-inner-icon="mdi-file-table-box-multiple-outline"
          type="number"
          min="1"
          :disabled="readOnly"
          :error-messages="errorMessagesTotal"
          :rules="[ validateTotal ]"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          ref="question.samplingRecord.sampleSize"
          v-model.number="question.samplingRecord.sampleSize"
          filled
          outlined
          :label="$t('app.questionnaire.group.question.sampling.sampleSize')"
          :hint="$t('app.questionnaire.group.question.sampling.sampleSizePlaceholder')"
          prepend-inner-icon="mdi-file-table-box-outline"
          type="number"
          min="1"
          :disabled="readOnly"
          :max="question.samplingRecord.approximateTotal"
          :error-messages="errorMessagesSize"
          :rules="[ validateSampleSize ]"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          ref="question.samplingRecord.nonCompliances"
          v-model.number="result.violationInfo.violationCount"
          filled
          outlined
          :label="$t('app.questionnaire.group.question.sampling.nonCompliances')"
          :hint="$t('app.questionnaire.group.question.sampling.nonCompliancesPlaceholder')"
          prepend-inner-icon="mdi-file-table-outline"
          type="number"
          min="0"
          :disabled="readOnly"
          :max="question.samplingRecord.sampleSize"
          :error-messages="errorMessagesCompliances"
          :rules="[ validateNonCompliance ]"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  name: 'SamplingRecord',
  props: {
    question: {
      type: Object,
      required: true
    },
    readOnly: {
      type: Boolean,
      required: true
    },
    result: {
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
    validateTotal (callback = true) {
      this.errorMessagesTotal = ''
      if (this.question.samplingRecord.approximateTotal === '' &&
          this.question.samplingRecord.sampleSize === '' &&
          this.result.violationInfo.violationCount === null) {
        return true
      }
      if (this.question.samplingRecord.sampleSize !== '' ||
          this.result.violationInfo.violationCount !== null) {
        if (this.question.samplingRecord.approximateTotal === '') {
          this.errorMessagesTotal = 'Approximate Total is required'
          return false
        }
        if (this.question.samplingRecord.approximateTotal < 1) {
          this.errorMessagesTotal = 'Approximate Total have to be greater than 1'
          return false
        }
      }
      if (this.question.samplingRecord.approximateTotal > 0 && this.question.samplingRecord.sampleSize > 0) {
        if (this.question.samplingRecord.approximateTotal < this.question.samplingRecord.sampleSize) {
          this.errorMessagesTotal = 'Approximate Total have to be equal or higher than Sample Size'
          return false
        }
      }
      if (callback) {
        this.validateSampleSize(false)
        this.validateNonCompliance(false)
      }
      return true
    },
    validateSampleSize (callback = true) {
      this.errorMessagesSize = ''
      if (this.question.samplingRecord.approximateTotal === '' &&
          this.question.samplingRecord.sampleSize === '' &&
          this.result.violationInfo.violationCount === null) {
        return true
      }
      if (this.question.samplingRecord.approximateTotal !== '' ||
          this.result.violationInfo.violationCount !== null) {
        if (this.question.samplingRecord.sampleSize === '') {
          this.errorMessagesSize = 'Sample Size is required'
          return false
        }
        if (this.question.samplingRecord.sampleSize < 1) {
          this.errorMessagesSize = 'Sample Size have to be greater than 1'
          return false
        }
      }
      if (this.question.samplingRecord.sampleSize > 0 && this.result.violationInfo.violationCount > 0) {
        if (this.question.samplingRecord.sampleSize < this.result.violationInfo.violationCount) {
          this.errorMessagesSize = 'Sample Size have to be equal or higher than Number of non-Compliance'
          return false
        }
      }
      if (callback) {
        this.validateTotal(false)
        this.validateNonCompliance(false)
      }
      return true
    },
    validateNonCompliance (callback = true) {
      this.errorMessagesCompliances = ''

      if (this.question.samplingRecord.approximateTotal === '' &&
          this.question.samplingRecord.sampleSize === '' &&
          this.result.violationInfo.violationCount === null) {
        return true
      }

      if (this.question.samplingRecord.approximateTotal !== '' ||
          this.question.samplingRecord.sampleSize !== '') {
        if (this.result.violationInfo.violationCount === null) {
          this.errorMessagesCompliances = 'Violation count is required'
          return false
        }
        if (this.result.violationInfo.violationCount < 0) {
          this.errorMessagesCompliances = 'Violation count have to be 0 or greater than 0'
          return false
        }
      }
      if (callback) {
        this.validateTotal(false)
        this.validateSampleSize(false)
      }
      return true
    }
  }
}
</script>

<style scoped>

</style>
