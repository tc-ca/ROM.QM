import { v4 as uuidv4 } from 'uuid';

export const namespaced = true

export const state = {
  notifications: []
}

export const getters = {
  hasNotifications(state) {
    return (state.notifications && state.notifications.length > 0);
  },
  getNotifications(state) {
    return state.notifications;
  }
}

export const actions = {
  show ({ commit }, notification) {
    if (!notification.guid) notification.guid = uuidv4();
    notification.showing = true
    notification.color = notification.color || 'success'
    notification.timeout = notification.timeout || 3000

    commit('SET_NOTIFICATIONS', notification)
  },
  addNotification ({ commit }, notification) {
    if (!notification.guid) notification.guid = uuidv4();
    notification.showing = false
    notification.color = notification.color || 'success'
    notification.timeout = notification.timeout || 6000

    commit('SET_NOTIFICATIONS', notification)
  },
  showNotifications ({commit}) {
    commit('setNotificationsVisible')
  },
  clearNotifications ({commit}) {
    commit('clearNotifications')
  }
}

export const mutations = {

  SET_NOTIFICATIONS (state, notification) {
    state.notifications.push(notification)
  },
  setNotificationsVisible (state) {
    if (state.notifications.length > 0) {
      state.notifications.forEach( n => n.showing = true )
    }
  },
  clearNotifications (state) {
    state.notifications = []
  }
}

