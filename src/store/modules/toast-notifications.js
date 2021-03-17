export const namespaced = true;

export const state = {
  notifications: []
};

export const actions = {
  show({ commit }, notification) {
    notification.showing = true;
    notification.color = notification.color || "success";
    notification.timeout = notification.timeout || 3000;

    commit("SET_NOTIFICATIONS", notification);
  }
};

export const mutations = {
  SET_NOTIFICATIONS(state, notification) {
    state.notifications.push(notification);
  }
};
