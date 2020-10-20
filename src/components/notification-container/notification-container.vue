<template>
  <div>
    <v-snackbar
      v-for="(notification, index) in notifications.filter(s => s.showing)"
      :key="notification.text + Math.random()"
      v-model="notification.showing"
      :timeout="notification.timeout"
      :color="notification.color"
      :style="`bottom: ${(index * 60) + 8}px`"
    >
      {{ notification.text }}
      <v-btn
        text
        @click="notification.showing = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState('notification', ['notifications'])
}

</script>

<style>
</style>
