<template>
  <v-list-group
    v-show="displayComment"
  >
    <template v-slot:appendIcon>
      <v-icon
        v-if="errorInComment"
        color="red"
      >
        mdi-exclamation
      </v-icon>
    </template>
    <template v-slot:activator>
      <v-list-item-title
        class="subtitle-1"
        style="color:#757575"
      >
        <v-row>
          <v-col>
            {{ label }}
            <v-icon
              v-if="isCommentRequired"
              color="red"
              small
            >
              mdi-alpha-r-box-outline
            </v-icon>
            <v-icon
              v-else
              color="primary"
              small
            >
              mdi-alpha-o-box-outline
            </v-icon>
          </v-col>
        </v-row>
      </v-list-item-title>
    </template>
    <v-list-item>
      <v-list-item-content>
        <v-textarea
          ref="textArea"
          v-model="comment.value"
          prepend-inner-icon="mdi-message-text-outline"
          auto-grow
          outlined
          filled
          clearable
          :disabled="readOnly"
          clear-icon="mdi-close-circle"
          :placeholder="placeholderText"
          rows="1"
          :hint="hint"
          :rules="rules"
          @update:error="onError"
        >
          <v-icon
            v-if="comment.required"
            slot="append"
            small
            color="red"
          >
            mdi-exclamation
          </v-icon>
        </v-textarea>
      </v-list-item-content>
    </v-list-item>
  </v-list-group>
</template>

<script>
import { mapState } from 'vuex'

export default {
  emits: ['error'],
  props: {
    comment: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    hint: {
      type: String,
      required: false,
      default: ''
    },
    question: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: true
    },
    saveToProp: {
      type: String,
      required: true
    },
    readOnly: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      rules: [
        value => !this.displayComment || !this.isCommentRequired ? true : !!this.comment.value || 'Required.'
      ],
      response: '',
      validationStatus: false,
      notification: null
    }
  },
  computed: {
    placeholderText () {
      return this.isCommentRequired ? this.$t('app.questionnaire.group.question.commentRequired') : this.$t('app.questionnaire.group.question.commentOptional')
    },
    isCommentRequired () {
      return this.comment.option === 'required'
    },
    displayComment () {
      return this.comment.option !== 'n/a'
    },
    errorInComment () {
      return this.displayComment && this.isCommentRequired && !this.comment.value
    },
    ...mapState({
      lang: state => {
        if (!state || !state.settings) {
          return 'en'
        }
        return state.settings.settings.lang
      }
    })
  },
  watch: {
    'comment.display' (newValue) {
      if (!newValue) {
        this.onError(false)
      }
    }
  },
  mounted () {
    this.$watch(
      '$refs.textArea.validations',
      (newValue) => {
        this.onError(this.errorInComment)
      }
    )
  },
  methods: {
    handler: function (value) {
      // TODO: better name of argument.
    },
    onError (error) {
      this.comment.validationStatus = !error
      if (!this.comment.validationStatus) {
        this.comment.notification = { header: `Question: ${this.question.text[this.lang]}`, text: `${this.comment.label} for this question is required. Please enter a value on the comment field.`, color: 'error' }
      } else {
        this.comment.notification = null
      }
      this.$emit('error', error)
    }
  }
}
</script>

<style scoped>
.v-expansion-panel-header {
  padding-left: 4px !important;
}
</style>

/*
  @change="handler($event)" on v-textarea
*/
