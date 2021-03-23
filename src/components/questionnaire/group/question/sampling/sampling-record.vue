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
      <v-col :cols="colSize">
        <v-text-field
          ref="question.samplingRecord.approximateTotal"
          v-model.number="samplingInfo.approximateTotal"
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
      <v-col :cols="colSize">
        <v-text-field
          ref="question.samplingRecord.sampleSize"
          v-model.number="samplingInfo.sampleSize"
          filled
          outlined
          :label="$t('app.questionnaire.group.question.sampling.sampleSize')"
          :hint="$t('app.questionnaire.group.question.sampling.sampleSizePlaceholder')"
          prepend-inner-icon="mdi-file-table-box-outline"
          type="number"
          min="1"
          :disabled="readOnly"
          :max="samplingInfo.approximateTotal"
          :error-messages="errorMessagesSize"
          :rules="[ validateSampleSize ]"
        />
      </v-col>
      <v-col
        v-if="hasProvisions"
        :cols="colSize"
      >
        <v-text-field
          ref="question.samplingRecord.nonCompliances"
          v-model.number="violationInfo.violationCount"
          filled
          outlined
          :label="$t('app.questionnaire.group.question.sampling.nonCompliances')"
          :hint="$t('app.questionnaire.group.question.sampling.nonCompliancesPlaceholder')"
          prepend-inner-icon="mdi-file-table-outline"
          type="number"
          min="0"
          :disabled="readOnly"
          :max="samplingInfo.sampleSize"
          :error-messages="errorMessagesCompliances"
          :rules="[ validateNonCompliance ]"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import { isEmptyValues } from '../../../../../utils.js'

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
    samplingInfo: {
      type: Object,
      required: true
    },
    violationInfo: {
      type: Object,
      required: true
    },
    hasProvisions: {
      type: Boolean,
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
    },
    approximateTotal () {
      return this.samplingInfo.approximateTotal
    },
    sampleSize () {
      return this.samplingInfo.sampleSize
    },
    violationCount () {
      return this.violationInfo.violationCount
    },
    colSize () {
      return this.hasProvisions ? '4' : '6'
    }
  },
  methods: {
    validateTotal (callback = true) {
      this.errorMessagesTotal = ''
      if (isEmptyValues(this.approximateTotal) &&
          isEmptyValues(this.sampleSize) &&
          isEmptyValues(this.violationCount)) {
        return true
      }
      if (!isEmptyValues(this.sampleSize) ||
          !isEmptyValues(this.violationCount)) {
        if (isEmptyValues(this.approximateTotal)) {
          this.errorMessagesTotal = 'Approximate Total is required'
          return false
        }
        if (this.approximateTotal < 1) {
          this.errorMessagesTotal = 'Approximate Total have to be greater than 1'
          return false
        }
      }
      if (this.approximateTotal > 0 && this.sampleSize > 0) {
        if (this.approximateTotal < this.sampleSize) {
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
      if (isEmptyValues(this.approximateTotal) &&
          isEmptyValues(this.sampleSize) &&
          isEmptyValues(this.violationCount)) {
        return true
      }
      if (!isEmptyValues(this.approximateTotal) ||
          !isEmptyValues(this.violationCount)) {
        if (isEmptyValues(this.sampleSize)) {
          this.errorMessagesSize = 'Sample Size is required'
          return false
        }
        if (this.sampleSize < 1) {
          this.errorMessagesSize = 'Sample Size have to be greater than 1'
          return false
        }
      }
      if (this.sampleSize > 0 && this.violationCount > 0) {
        if (this.sampleSize < this.violationCount) {
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

      if (isEmptyValues(this.approximateTotal) &&
          isEmptyValues(this.sampleSize) &&
          isEmptyValues(this.violationCount)) {
        return true
      }

      if (!isEmptyValues(this.approximateTotal) ||
          !isEmptyValues(this.sampleSize)) {
        if (isEmptyValues(this.violationCount)) {
          this.errorMessagesCompliances = 'Violation count is required'
          return false
        }
        if (this.violationCount < 0) {
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
