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
  //possible future refactor work, be able to pass dependencies i.e. questions which would allow you to validate specific sets of questions if wanted. 
   buildValidationList ({ dispatch, rootState }) {

    let grpIndex = 0;
    const questionnaire = rootState.questionnaire.questionnaire;
    const lang = rootState.settings.settings.lang;

    questionnaire.groups.forEach(group => {
      let qIndex = 0;
      group.questions.forEach(question => {
       SetQuestionNotificationsToList(question,grpIndex,qIndex,0,dispatch,lang);
           
        qIndex++;
      });
      grpIndex++;
    });
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
};

function SetQuestionNotificationsToList(q, groupIndex, queIndex, depth, dispatch, lang)
{
   if (q.isVisible) {
    if (q.notification) {
      dispatch("notification/addNotification", q.notification, { root: true });
    } else if (!q.validationState || !q.response) {
      q.notification = buildNotificationObject(q, 'A valid response for the question is required.', groupIndex, queIndex, depth, 'mdi-message-draw', lang);
      dispatch("notification/addNotification", q.notification, { root: true });
    } else if(q.responseOptions) {
      q.responseOptions.forEach(op => {
        if (op.internalComment && op.internalComment.notification) {
          dispatch('notification/addNotification', op.internalComment.notification,{root:true});
        } else if (op.internalComment && op.internalComment.option === 'required' && op.internalComment.value.trim().length === 0) {
          op.internalComment.notification = buildNotificationObject(q, `Internal Comment for the response type ${op.text[lang]} is required.`, groupIndex, queIndex, depth, 'mdi-message-alert', lang);
          dispatch('notification/addNotification', op.internalComment.notification,{root:true});
        }
        if (op.externalComment && op.externalComment.notification) {
          dispatch('notification/addNotification', op.externalComment.notification,{root:true});
        } else if (op.externalComment && op.externalComment.option === 'required' && op.externalComment.value.trim().length === 0) {
          op.externalComment.notification = buildNotificationObject(q, `External Comment for the response type ${op.text[lang]} is required.`, groupIndex, queIndex, depth, 'mdi-message-alert', lang);
          dispatch('notification/addNotification', op.externalComment.notification,{root:true});
        }
        if (op.picture && op.picture.notification) {
          dispatch('notification/addNotification', op.picture.notification,{root:true});
        } else if (op.picture && op.picture.option === 'required' && op.picture.value.trim().length === 0) {
          op.picture.notification = buildNotificationObject(q, `A picture for the response type ${op.text[lang]} is required.`, groupIndex, queIndex, depth, 'mdi-image-plus', lang);
          dispatch('notification/addNotification', op.picture.notification, {root:true});
        }
      });
    }
    if(q.childQuestion) {
      q.childQuestions.forEach(child => {
        SetQuestionNotificationsToList(child, groupIndex, queIndex, ++depth, dispatch, lang);
      });
    }
  }
}

function buildNotificationObject (q, text, groupIndex, queIndex, depth, icon = 'mdi-message-alert', lang = 'en', color = 'error', timeout = 5000) {
  const notice = { 
    guid: uuidv4(),
    header: `Question: ${q.text[lang]}`, 
    text: text, 
    icon: icon, 
    color: color,
    groupIndex: groupIndex,
    questionId: queIndex,
    qguid: q.guid,
    depth: depth,
    timeout: timeout
  };
  return notice;
}

