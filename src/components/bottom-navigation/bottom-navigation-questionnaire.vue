<template>
  <v-bottom-navigation
    background-color="rgba(241, 241, 241, 0.9)"
    fixed
    color="primary"
  >
    <!-- NAVIGATION BUTTON -->
    <v-btn
      @click="displayNavigation()"
    >
      <span>  {{ $t('app.bottom-navigation.navigation') }}</span>

      <v-icon color="green">
        mdi-navigation
      </v-icon>
    </v-btn>
    <!-- COLLASPE ALL BUTTON -->
    <v-btn @click="expand()">
      <span v-if="isExpandPanelsData.value==false">{{ $t('app.bottom-navigation.expand') }} </span>
      <span v-if="isExpandPanelsData.value===true">{{ $t('app.bottom-navigation.collaspe') }}</span>

      <v-icon
        v-if="isExpandPanelsData.value===false"
        color="purple"
      >
        mdi-arrow-expand-vertical
      </v-icon>
      <v-icon
        v-if="isExpandPanelsData.value===true"
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
      <span>{{ $t('app.bottom-navigation.scrollUp') }}</span>
      <v-icon color="purple">
        mdi-arrow-up
      </v-icon>
    </v-btn>
    <!-- VALIDATE BUTTON -->
    <v-btn
      @click="validate"
    >
      <span>{{ $t('app.bottom-navigation.validate') }}</span>
      <v-badge
        v-if="notifications.length > 0"
        :content="notifications.length"
        :value="true"
        color="red"
        overlap
        inline
      >
        <v-icon color="purple">
          mdi-check-all
        </v-icon>
      </v-badge>
      <v-icon
        v-if="notifications.length=== 0"
        color="purple"
      >
        mdi-check-all
      </v-icon>
    </v-btn>
    <!-- READ ONLY BUTTON -->
    <v-btn
      v-if="envDev"
      @click="setReadOnly"
    >
      <span v-if="!isReadOnlyData">{{ $t('app.bottom-navigation.lockData') }}</span>
      <span v-if="isReadOnlyData">{{ $t('app.bottom-navigation.unlockData') }}</span>

      <v-icon
        v-if="isReadOnlyData"
        color="purple"
      >
        mdi-lock-outline
      </v-icon>
      <v-icon
        v-if="!isReadOnlyData"
        color="purple"
      >
        mdi-lock-open-outline
      </v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import BaseMixin from '../../mixins/base'
import { mapState } from 'vuex'

export default {
  emits: ['expand-panels', 'scroll-to-top', 'validate', 'set-read-only', 'display-navigation'],
  mixins: [BaseMixin],
  props: {
    isExpandPanels: {

      type: Object,
      required: true
    },
    isReadOnly: {
      type: Boolean,
      required: true
    }
  },
  data: function () {
    return {
      isExpandPanelsData: this.isExpandPanels,
      isReadOnlyData: this.isReadOnly
    }
  },
  computed: {
    ...mapState({
      notifications: state => {
        return state.notification.notifications
      },
      displayValidationErrors: state => {
        return state.notification.displayValidationErrors
      }

    }),
    hasNotifications () {
      return this.notifications.length > 0
    }
  },
  methods: {
    expand () {
      this.isExpandPanelsData.value = !this.isExpandPanels.value
      this.$emit('expand-panels', !this.isExpandPanelsData)
    },
    scrollToTop () {
      this.$emit('scroll-to-top')
    },
    validate () {
      this.$emit('validate')
    },
    setReadOnly () {
      this.isReadOnlyData = !this.isReadOnlyData
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
