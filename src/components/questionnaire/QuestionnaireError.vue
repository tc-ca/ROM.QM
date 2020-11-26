<template>
  <v-card>
    <v-list>
      <v-list-item
        v-for="notification in q_notifications"
        :key="notification.id"
      >
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ notification.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: {
    qNotifications: {
      type: Array,
      required: true
    }
  },
  computed: {
    hasNotifications () {
      return this.qNotifications.length > 0
    }
  }
}
</script>

<style scoped>

</style>
