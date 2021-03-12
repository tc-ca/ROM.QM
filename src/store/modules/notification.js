import { v4 as uuidv4 } from 'uuid';

export const namespaced = true

export const state = {
  notifications: [],
  displayValidationErrors: false
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
  if (q.notification) {
    q.notification = null;
  }
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
        // This is the response selected
        if (op.internalComment && op.internalComment.notification) {
          dispatch('notification/addNotification', op.internalComment.notification,{root:true});
        } else if (op.internalComment && op.internalCommentRequirement === 'required' && op.internalComment.value.trim().length === 0) {
          const msg = {
            en: `Internal Comment for the response type ${op.text[lang]} is required.`,
            fr: `Commentaire interne pour le type de réponse ${op.text[lang]} est requis.`
          }
          op.internalComment.notification = buildNotificationObject(q, msg[lang], groupIndex, queIndex, depth, 'mdi-message-alert', lang);
          dispatch('notification/addNotification', op.internalComment.notification,{root:true});
        }
        if (op.externalComment && op.externalComment.notification) {
          dispatch('notification/addNotification', op.externalComment.notification,{root:true});
        } else if (op.externalComment && op.externalCommentRequirement === 'required' && op.externalComment.value.trim().length === 0) {
          const msg = {
            en: `External Comment for the response type ${op.text[lang]} is required.`,
            fr: `Commentaire externe pour le type de réponse ${op.text[lang]} est requis.`
          }
          op.externalComment.notification = buildNotificationObject(q, msg[lang], groupIndex, queIndex, depth, 'mdi-message-alert', lang);
          dispatch('notification/addNotification', op.externalComment.notification,{root:true});
        }
        if (op.file && op.file.notification) {
          dispatch('notification/addNotification', op.file.notification,{root:true});
        } else if (op.file && op.fileRequirement === 'required' && q.result.files.length === 0) {
          const msg = {
            en: `A File for the response type ${op.text[lang]} is required.`,
            fr: `Un fichier pour le type de réponse ${op.text[lang]} est requis.`
          }
          op.file.notification = buildNotificationObject(q, msg[lang], groupIndex, queIndex, depth, 'mdi-image-plus', lang);
          dispatch('notification/addNotification', op.file.notification, {root:true});
        }
        if (op.picture && op.picture.notification) {
          dispatch('notification/addNotification', op.picture.notification,{root:true});
        } else if (op.picture && op.pictureRequirement === 'required' && q.result.pictures.length === 0) {
          const msg = {
            en: `A Picture for the response type ${op.text[lang]} is required.`,
            fr: `Une image pour le type de réponse ${op.text[lang]} est requis.`
          }
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
          q.notification = buildNotificationObject(q, vr.errorMessage[lang], groupIndex, queIndex, depth, 'mdi-message-draw', lang);
          dispatch("notification/addNotification", q.notification, { root: true });
        } else {
          if (!validateMinValue(q,vr) || !validateMinLength(q,vr) || !validateMaxValue(q,vr) || !validateMaxLength(q,vr)) {
            q.notification = buildNotificationObject(q, vr.errorMessage[lang], groupIndex, queIndex, depth, 'mdi-message-draw', lang);
            dispatch("notification/addNotification", q.notification, { root: true });
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
    if (q.notification) {
      dispatch("notification/addNotification", q.notification, { root: true });
    } else if (isValidationRequired(q)) {
      if (!q.validationState || (q.result && !q.result.responses[0].value)) {
        const msg = {
          en: "A valid response for the question is required.",
          fr: "Une réponse valide à la question est requise."
        }
        q.notification = buildNotificationObject(q, msg[lang], groupIndex, queIndex, depth, 'mdi-message-draw', lang);
        dispatch("notification/addNotification", q.notification, { root: true });
      } else {
        //If there are responseOptions
        validateResponseOptions(q, groupIndex, queIndex, depth, dispatch, lang);

        // Now the validationRules
        evaluateValidationRules(q, groupIndex, queIndex, depth, dispatch, lang);

      }
    }

    if(q.childQuestions && q.childQuestions.length > 0) {
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

