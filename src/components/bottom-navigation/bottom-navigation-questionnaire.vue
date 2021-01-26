<template>
  <v-bottom-navigation
    background-color="rgba(241, 241, 241, 0.9)"
    fixed
    color="primary"
  >
    <v-btn
      @click="displayNavigation()"
    >
      <span>Navigation</span>

      <v-icon color="green">
        mdi-navigation
      </v-icon>
    </v-btn>
    <!-- COLLASPE ALL BUTTON -->
    <v-btn @click="expand()">
      <span v-if="isExpand===false">Expand All </span>
      <span v-if="isExpand===true">Collaspe All</span>

      <v-icon
        v-if="isExpand===false"
        color="purple"
      >
        mdi-arrow-expand-vertical
      </v-icon>
      <v-icon
        v-if="isExpand===true"
        color="purple"
      >
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
      <span>Make Read Only</span>
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
  data: function () {
    return {
      isExpand: true
    }
  },
  methods: {
    expand () {
      this.isExpand = !this.isExpand
      this.$emit('expand-panels', !this.isExpand)
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
