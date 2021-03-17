import { v4 as uuidv4 } from 'uuid';
import i18n from '../../i18n'
import {isEmptyValues} from '../../utils.js'

export const namespaced = true

export const state = {
  notifications: [],
}

export const getters = {
}


export const actions = {
  show ({ commit }, notification) {
    commit('SET_NOTIFICATIONS', notification)
  },

  addErrorNotification ({ commit }, notification) {
    commit('SET_NOTIFICATIONS', notification)
  },
  
  clearNotifications ({commit}) {
    commit("CLEAR_NOTIFICATIONS");
  },

    //possible future refactor work, be able to pass dependencies i.e. questions which would allow you to validate specific sets of questions if wanted. 
  validateQuestions ({ dispatch, rootState }) {

    //clear up any previous errors/notifications
    dispatch("clearNotifications", { root: true });

    const questionnaire = rootState.questionnaire.questionnaire;
    const lang = rootState.settings.settings.lang;

    questionnaire.groups.forEach(group => {
      group.questions.forEach(question => {
        SetQuestionNotificationsToList(question, dispatch, lang);
      });
    });

  },
}

export const mutations = {

  SET_NOTIFICATIONS (state, notification) {
    state.notifications.push(notification)
  },

  CLEAR_NOTIFICATIONS (state) {
    state.notifications = []
  }
};



function isValidationRequired(q)
{
  let result = -1;
  if (q.validationRules) result = q.validationRules.findIndex( v => v.enabled);
  return result > -1;
}

function validateResponseOptions(q, dispatch, lang) {
  if(q.responseOptions) {
    for( let x = 0; x < q.responseOptions.length; x++) {
      const op = q.responseOptions[x];
      if (q.result) {
        if (op.internalCommentRequirement === 'required' &&  isEmptyValues(q.result.internalComment)) {
 
          const errorMsg = i18n.t('app.notifications.internalComment', { type: op.text[lang] } )
           const notification = buildNotificationObject(q, errorMsg, 'mdi-message-alert', lang);
          dispatch('notification/addErrorNotification', notification,{root:true});
        }
        if (op.externalCommentRequirement === 'required'  && isEmptyValues(q.result.externalComment)) {

          const errorMsg = i18n.t('app.notifications.externalComment', { type: op.text[lang] } )

          const notification = buildNotificationObject(q, errorMsg, 'mdi-message-alert', lang);
          dispatch("notification/addErrorNotification", notification, {
            root: true
          });
        }
        if (op.fileRequirement === 'required' && isEmptyValues(q.result.files)) {

          const errorMsg = i18n.t('app.notifications.file', { type: op.text[lang] } )

          const notification  = buildNotificationObject(q, errorMsg, 'mdi-image-plus', lang);
          dispatch("notification/addErrorNotification", notification, {
            root: true
          });
        }
        if (op.pictureRequirement === 'required' && isEmptyValues(q.result.pictures)) {
          const errorMsg = i18n.t('app.notifications.picture', { type: op.text[lang] } )

          const notification = buildNotificationObject(q, errorMsg[lang], 'mdi-image-plus', lang);
          dispatch("notification/addErrorNotification", notification, {
            root: true
          });
        }
      }
    }
  }
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

function evaluateValidationRules(q, dispatch, lang) {
  if( q.validationRules) {
    q.validationRules.forEach( vr => {
      if (vr.enabled) {
        if (q.result && !q.result.responses[0].value) {
          const notification = buildNotificationObject(q, vr.errorMessage[lang], 'mdi-message-draw', lang);
          dispatch("notification/addErrorNotification", notification, { root: true });
        } else {
          if (!validateMinValue(q,vr) || !validateMinLength(q,vr) || !validateMaxValue(q,vr) || !validateMaxLength(q,vr)) {
            const notification = buildNotificationObject(q, vr.errorMessage[lang], 'mdi-message-draw', lang);
            dispatch("notification/addErrorNotification", notification, { root: true });
          }
        }
      }
    });
    return true;
  }
  return false;
}

function SetQuestionNotificationsToList(q, dispatch, lang)
{
   if (q.isVisible) {
    if (isValidationRequired(q)) {
        const msg = i18n.t('app.notifications.question')
        const notification = buildNotificationObject(q, msg, 'mdi-message-draw', lang);
 
        //validate question
        dispatch("notification/addErrorNotification", notification, { root: true });
        //validate supplementary info
        validateResponseOptions(q, dispatch, lang);
        //validate rules
        evaluateValidationRules(q, dispatch, lang);
        
      }
    
        //validate children questions 
    if(q.childQuestions && q.childQuestions.length > 0) {
      q.childQuestions.forEach(child => {
        SetQuestionNotificationsToList(child, dispatch, lang);
      });
    }
  }
}

function buildNotificationObject (q, text, icon = 'mdi-message-alert', lang) {
  const notice = { 
    guid: uuidv4(),
    header: i18n.t('app.notifications.header', { text: q.text[lang] }),        
    text: text, // error of msg
    icon: icon, 
    color: 'error',
    qguid: q.guid,
  };
  return notice;
}

