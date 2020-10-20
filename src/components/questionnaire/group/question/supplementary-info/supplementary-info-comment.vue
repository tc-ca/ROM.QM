<template>
  <v-expansion-panel v-show="comment.display">
    <v-expansion-panel-header class="subtitle-2">
      <span>
        {{ label }}
        <span
          v-if="comment.required"
          style="color: red"
        >(required)</span>
        <span v-else>(optional)</span>
      </span>
      <v-icon
        v-if="!comment.validationState"
        color="red"
      >
        mdi-exclamation
      </v-icon>
    </v-expansion-panel-header>
    <v-expansion-panel-content eager>
      <br>
      <v-textarea
        ref="textArea"
        v-model="response"
        auto-grow
        dense
        outlined
        filled
        :placeholder="placeholderText"
        rows="1"
        :hint="hint"
        :rules="rules"
        @update:error="onError"
        @change="handler($event)"
      >
        <v-icon
          v-if="comment.required"
          slot="append"
          large
          color="red"
        >
          mdi-exclamation
        </v-icon>
        <!-- <v-icon v-else slot="append" large color="green">mdi-check</v-icon> -->
      </v-textarea>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  // props: ['display', 'required', 'label', 'hint', 'question', 'group', 'saveToProp'],
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
    }
  },
  data () {
    return {
      rules: [
        value => !this.comment.display || !this.comment.required ? true : !!this.response || 'Required.'
      ],
      response: ''
    }
  },
  computed: {
    placeholderText () {
      const required = this.comment.required
      return required ? 'comment required' : ''
    }
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
        let error = this.comment.display && this.comment.required && !this.response
        this.onError(error)
      }
    )
  },
  methods: {

    // TODO: think of a better name
    updateResponseStore: function (response) {
      const question = this.question
      const group = this.group
      const saveToProp = this.saveToProp
      this.$store.dispatch('updateSupplementaryInfo', { saveToProp, group, question, response })
    },
    handler: function (value) {
      // TODO: better name of argument.
      this.updateResponseStore(value)
    },
    onError (error) {
      this.comment.validationStatus = !error
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
