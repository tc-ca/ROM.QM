<template>
  <v-bottom-navigation
    background-color="rgba(241, 241, 241, 0.9)"
    shift
    fixed
  >
    <v-btn
      @click="displayNavigation()"
    >
      <span>Navigation</span>

      <v-icon color="green">
        mdi-navigation
      </v-icon>
    </v-btn>
    <!-- EXPAND ALL BUTTON -->

    <v-btn
      @click="expand(true)"
    >
      <span>Exapand All</span>

      <v-icon
        color="purple"
      >
        mdi-arrow-collapse-vertical
      </v-icon>
    </v-btn>
    <!-- COLLASPE ALL BUTTON -->

    <v-btn @click="expand(false)">
      <span>collaspe all</span>

      <v-icon color="purple">
        mdi-arrow-collapse-vertical
      </v-icon>
    </v-btn>
    <!-- SCROLL TO TOP BUTTON -->
    <v-btn
      class="btnTop"
      @click="scrollToTop"
    >
      <span>Scroll Up</span>
      <v-icon color="purple">
        mdi-arrow-up
      </v-icon>
    </v-btn>
    <!-- VALIDATE -->
    <v-btn
      v-if="envDev"
      @click="validate"
    >
      <span>Validate</span>
      <v-icon color="purple">
        mdi-check-all
      </v-icon>
    </v-btn>
    <!-- READ ONLY -->
    <v-btn
      v-if="envDev"
      @click="setReadOnly"
    >
      <span>Read Only</span>
      <v-icon color="purple">
        mdi-lock-open-outline
      </v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import BaseMixin from '../../mixins/base'

export default {
  emits: ['expand-panels', 'scroll-to-top', 'validate', 'set-read-only', 'display-navigation'],
  mixins: [BaseMixin],
  methods: {
    expand (expand) {
      this.$emit('expand-panels', expand)
    },
    scrollToTop () {
      this.$emit('scroll-to-top')
    },
    validate () {
      this.$emit('validate')
    },
    setReadOnly () {
      this.$emit('set-read-only')
    },
    displayNavigation () {
      this.$emit('display-navigation')
    }
  }
}
</script>

<style scoped>
</style>
