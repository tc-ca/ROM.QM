import { v4 as uuidv4 } from 'uuid';
import i18n from '../../i18n'

export const namespaced = true

export const state = {
  notifications: [],
  displayValidationErrors: false
}

export const getters = {
  hasNotifications(state) {
    return (state.notifications && state.notifications.length > 0);
  }
}


export const actions = {
  show ({ commit }, notification) {
    if (!notification.guid) notification.guid = uuidv4();
    commit('SET_NOTIFICATIONS', notification)
  },

  addNotification ({ commit }, notification) {
    if (!notification.guid) notification.guid = uuidv4();
    commit('SET_NOTIFICATIONS', notification)
  },

  setDisplayValidationErrorsState ({ commit }, payload) {
    commit('SET_DISPLAY_VALIDATION_ERRORS', payload)
  },
  
  //possible future refactor work, be able to pass dependencies i.e. questions which would allow you to validate specific sets of questions if wanted. 
  validateQuestions ({ dispatch, rootState }, payload) {
    const { displayValidationErrors } = payload;
    dispatch("setDisplayValidationErrorsState", displayValidationErrors);

    //clear up any previous errors/notifications
    dispatch("clearNotifications", { root: true });

    let grpIndex = 0;
    const questionnaire = rootState.questionnaire.questionnaire;
    const lang = rootState.settings.settings.lang;

    questionnaire.groups.forEach(group => {
      let qIndex = 0;
      group.questions.forEach(question => {
        console.log(question.text["en"]);
        SetQuestionNotificationsToList(question,grpIndex,qIndex,0,dispatch,lang);
        qIndex++;
      });
      grpIndex++;
    });

  },

  showNotifications ({commit}) {
    commit("SET_NOTIFICATIONS_VISIBLE");
  },

  clearNotifications ({commit, rootState}) {
    commit("CLEAR_NOTIFICATIONS");
    const questionnaire = rootState.questionnaire.questionnaire;
    if (questionnaire && questionnaire.groups) {
      questionnaire.groups.forEach(group => {
        if (group.questions) {
          group.questions.forEach(question => {
            ClearPreviousNotifications(question);
          });
        }
      });
    }
  }
}

export const mutations = {

  SET_NOTIFICATIONS (state, notification) {
    state.notifications.push(notification)
  },
  SET_NOTIFICATIONS_VISIBLE  (state) {
    if (state.notifications.length > 0) {
      state.notifications.forEach( n => n.showing = true )
    }
  },
  CLEAR_NOTIFICATIONS (state) {
    state.notifications = []
  },
    SET_DISPLAY_VALIDATION_ERRORS (state, payload) {
    state.displayValidationErrors = payload;
  }
};

function ClearPreviousNotifications(q)
{
  if(q.responseOptions) {
    q.responseOptions.forEach(op => {
      if (op.internalComment && op.internalComment.notification) {
        op.internalComment.notification = null;
      }
      if (op.externalComment && op.externalComment.notification) {
        op.externalComment.notification = null;
      }
      if (op.picture && op.picture.notification) {
        op.picture.notification = null;
      }
    });
  }  
  if(q.childQuestions) {
    q.childQuestions.forEach(child => {
      ClearPreviousNotifications(child);
    });
  }
}

function isValidationRequired(q)
{
  let result = -1;
  if (q.validationRules) result = q.validationRules.findIndex( v => v.enabled);
  return result > -1;
}

function validateResponseOptions(q, groupIndex, queIndex, depth, dispatch, lang) {
  if(q.responseOptions) {
    for( let x = 0; x < q.responseOptions.length; x++) {
      const op = q.responseOptions[x];
      if (q.result && q.result.responses[0].value === op.value) {
        if (op.internalComment && op.internalComment.notification) {
          dispatch('notification/addNotification', op.internalComment.notification,{root:true});
        } else if (op.internalComment && op.internalCommentRequirement === 'required' && op.internalComment.value.trim().length === 0) {
 
          const msg = i18n.t$('app.notifications.internalComment', { type: op.text[lang] } )
          op.internalComment.notification = buildNotificationObject(q, msg, groupIndex, queIndex, depth, 'mdi-message-alert', lang);
          dispatch('notification/addNotification', op.internalComment.notification,{root:true});
        }
        if (op.externalComment && op.externalComment.notification) {
          dispatch('notification/addNotification', op.externalComment.notification,{root:true});
        } else if (op.externalComment && op.externalCommentRequirement === 'required' && op.externalComment.value.trim().length === 0) {

          const msg = i18n.t$('app.notifications.externalComment', { type: op.text[lang] } )

          op.externalComment.notification = buildNotificationObject(q, msg, groupIndex, queIndex, depth, 'mdi-message-alert', lang);
          dispatch('notification/addNotification', op.externalComment.notification,{root:true});
        }
        if (op.file && op.file.notification) {
          dispatch('notification/addNotification', op.file.notification,{root:true});
        } else if (op.file && op.fileRequirement === 'required' && q.result.files.length === 0) {

          const msg = i18n.t$('app.notifications.file', { type: op.text[lang] } )

          op.file.notification = buildNotificationObject(q, msg, groupIndex, queIndex, depth, 'mdi-image-plus', lang);
          dispatch('notification/addNotification', op.file.notification, {root:true});
        }
        if (op.picture && op.picture.notification) {
          dispatch('notification/addNotification', op.picture.notification,{root:true});
        } else if (op.picture && op.pictureRequirement === 'required' && q.result.pictures.length === 0) {
          const msg = i18n.t$('app.notifications.picture', { type: op.text[lang] } )

          op.picture.notification = buildNotificationObject(q, msg[lang], groupIndex, queIndex, depth, 'mdi-image-plus', lang);
          dispatch('notification/addNotification', op.picture.notification, {root:true});
        }
      }
    }
    return true; 
  }
  return false;
}

function validateMinValue( q, vr) {
  if ((vr.type === 'min') && (isNaN(q.result.responses[0].value) || !vr.value || (+q.result.responses[0].value < +vr.value))) return false;
  return true;
}

function validateMinLength(q, vr) {
  if ((vr.type === 'minLength') && (!vr.value || (String(q.result.responses[0].value).length < +vr.value))) return false;
  return true;
}

function validateMaxValue(q, vr) {
  if ( (vr.type === 'max') && (isNaN(q.result.responses[0].value) || !vr.value || (+q.result.responses[0].value > +vr.value))) return false;
  return true;
}

function validateMaxLength(q, vr) {
  if ((vr.type === 'maxLength') && (!vr.value || (String(q.result.responses[0].value).length > +vr.value))) return false;
  return true;
}

function evaluateValidationRules(q, groupIndex, queIndex, depth, dispatch, lang) {
  if( q.validationRules) {
    q.validationRules.forEach( vr => {
      if (vr.enabled) {
        if (q.result && !q.result.responses[0].value) {
          const notification = buildNotificationObject(q, vr.errorMessage[lang], groupIndex, queIndex, depth, 'mdi-message-draw', lang);
          dispatch("notification/addNotification", notification, { root: true });
        } else {
          if (!validateMinValue(q,vr) || !validateMinLength(q,vr) || !validateMaxValue(q,vr) || !validateMaxLength(q,vr)) {
            const notification = buildNotificationObject(q, vr.errorMessage[lang], groupIndex, queIndex, depth, 'mdi-message-draw', lang);
            dispatch("notification/addNotification", notification, { root: true });
          }
        }
      }
    });
    return true;
  }
  return false;
}

function SetQuestionNotificationsToList(q, groupIndex, queIndex, depth, dispatch, lang)
{
   if (q.isVisible) {
    if (isValidationRequired(q)) {
        const msg = i18n.t('app.notifications.question')
        const notification = buildNotificationObject(q, msg, groupIndex, queIndex, depth, 'mdi-message-draw', lang);
        dispatch("notification/addNotification", notification, { root: true });
        
      } else {
        //If there are responseOptions
        validateResponseOptions(q, groupIndex, queIndex, depth, dispatch, lang);
        // Now the validationRules
        evaluateValidationRules(q, groupIndex, queIndex, depth, dispatch, lang);
    }

    if(q.childQuestions && q.childQuestions.length > 0) {
      q.childQuestions.forEach(child => {
        SetQuestionNotificationsToList(child, groupIndex, queIndex, ++depth, dispatch, lang);
      });
    }
  }
}

function buildNotificationObject (q, text, groupIndex, queIndex, depth, icon = 'mdi-message-alert') {
  const notice = { 
    guid: uuidv4(),
    header: i18n.t('app.notifications.header', { text: q.text['en'] }),        
    text: text, // error
    icon: icon, 
    color: 'error',
    groupIndex: groupIndex,
    questionId: queIndex,
    qguid: q.guid,
    depth: depth,
    timeout: 5000
  };
  return notice;
}

