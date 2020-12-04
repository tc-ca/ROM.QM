<template>
  <v-card
    class="mx-auto"
    tile
  >
    <v-list three-line>
      <template v-for="(notification, index) in notifications">
        <v-list-item :key="index">
          <v-list-item-avatar>
            <v-icon
              :color="notification.color"
            >
              {{ notification.icon }}
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <!-- eslint-disable vue/no-v-html -->
            <v-list-item-title
              class="actionLink"
              @click="$emit('notification:click', notification)"
              v-html="notification.header"
            />
            <v-list-item-subtitle v-html="notification.text" />
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'QuestionnaireError',
  props: {
    notifications: {
      type: Array,
      required: true
    }
  },
  computed: {
    hasNotifications () {
      return this.notifications.length > 0
    }
  },
  created () {
    console.log(JSON.stringify(this.notifications))
  }
}
</script>

<style scoped>
.actionLink:hover {
  color: crimson;
  cursor:pointer;
  text-decoration: underline;
}
</style>
