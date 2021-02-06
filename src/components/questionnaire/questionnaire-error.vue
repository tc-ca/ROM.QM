<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      right
      fixed
      temporary
      app
    >
      <v-list
        three-line
        nav
        dense
      >
        <div
          v-for="(notification, index) in notifications"
          :key="index"
        >
          <v-list-item>
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
        </div>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'QuestionnaireError',
  events: ['close'],
  props: {
    isVisible: {
      type: Boolean,
      required: true
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
    },
    drawer: {
      get () { return this.isVisible },
      set (value) {
        if (!value) this.$emit('close', value)
      }
    }
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
