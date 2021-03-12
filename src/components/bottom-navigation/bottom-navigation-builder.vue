<template>
  <v-bottom-navigation
    background-color="rgba(241, 241, 241, 0.9)"
    shift
    fixed
  >
    <v-btn
      @click="clear()"
    >
      <span>Clear</span>

      <v-icon color="purple">
        mdi-close-thick
      </v-icon>
    </v-btn>
    <v-btn
      @click="save()"
    >
      <span>Save</span>

      <v-icon color="purple">
        mdi-content-save
      </v-icon>
    </v-btn>
    <v-btn
      @click="fixIt(true)"
    >
      <span>Fix it.</span>

      <v-icon color="purple">
        mdi-hammer-wrench
      </v-icon>
    </v-btn>
    <v-btn
      @click="updateIt(true)"
    >
      <span>Update it.</span>

      <v-icon color="purple">
        mdi-reload-alert
      </v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import BaseMixin from '../../mixins/base'

export default {
  emits: ['clear', 'save', 'fix-it'],
  mixins: [BaseMixin],
  methods: {
    clear () {
      this.$emit('clear')
    },
    save () {
      this.$emit('save')
    },
    fixIt () {
      this.$emit('fix-it')
    },
    updateIt () {
      this.$emit('update-it')
    }
  }
}
</script>

<style scoped>
</style>
