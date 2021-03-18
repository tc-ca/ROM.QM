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
    //possible future refactor work, be able to pass dependencies i.e. questions which would allow you to validate specific sets of questions if wanted. 
  validateQuestions ({ commit, rootState }) {

    //clear up any previous errors/notifications
    commit("CLEAR_NOTIFICATIONS");

    const questionnaire = rootState.questionnaire.questionnaire;
    const lang = rootState.settings.settings.lang;

    // gets all error notifications
    let errorNotifications = []
    questionnaire.groups.forEach(group => {
      group.questions.forEach(question => {
        errorNotifications = errorNotifications.concat(getQuestionErrorNotifications(question, lang))
      });
    });

    commit("SET_NOTIFICATIONS", errorNotifications);
  },
}

export const mutations = {

  //expects a single object notification
  SET_NOTIFICATION (state, notification) {
    state.notifications.push(notification)
  },
  
  //expects an array of notifications
  SET_NOTIFICATIONS (state, notifications) {
    state.notifications = notifications
  },

  CLEAR_NOTIFICATIONS (state) {
    state.notifications = []
  }
};



function isValidationRequired(q)
{
  let result = -1;
  if (q.validationRules) result = q.validationRules.findIndex( v => v.enabled);
  if (result > -1) return true;
  if (q.result) return true;
  return false;
}

function validateResponseOptions(q, lang) {
  let errorNotifications = []
  if(q.responseOptions) {
    for( let x = 0; x < q.responseOptions.length; x++) {
      const op = q.responseOptions[x];
      if (q.result) {
        if (op.internalCommentRequirement === 'required' &&  isEmptyValues(q.result.internalComment)) {
          const errorMsg = i18n.t('app.notifications.internalComment', { type: op.text[lang] } )
           errorNotifications.push(buildNotificationObject(q, errorMsg, 'mdi-message-alert', lang))
        }
        if (op.externalCommentRequirement === 'required'  && isEmptyValues(q.result.externalComment)) {
          const errorMsg = i18n.t('app.notifications.externalComment', { type: op.text[lang] } )
            errorNotifications.push(buildNotificationObject(q, errorMsg, 'mdi-message-alert', lang));
        }
        if (op.fileRequirement === 'required' && isEmptyValues(q.result.files)) {

          const errorMsg = i18n.t('app.notifications.file', { type: op.text[lang] } )
          errorNotifications.push(buildNotificationObject(q, errorMsg, 'mdi-image-plus', lang));
        }
        if (op.pictureRequirement === 'required' && isEmptyValues(q.result.pictures)) {
          const errorMsg = i18n.t('app.notifications.picture', { type: op.text[lang] } )
          errorNotifications.push(buildNotificationObject(q, errorMsg, 'mdi-image-plus', lang));
        }
      }
    }
  }
  return errorNotifications  
}

function isValidRule( q, vr) {

  switch (vr.type) {
    case "min":
      return (
        !q.result.responses.some(response => isNaN(response.value)) &&
        !q.result.responses.some(response => +response.value < +vr.value)
      );
    case "max":
      return (
        !q.result.responses.some(response => isNaN(response.value)) &&
        !q.result.responses.some(response => +response.value > +vr.value)
      );
    case "minLength":
      return !q.result.responses.some(
        response => String(response.value).length < +vr.value
      );
    case "maxLength":
      return !q.result.responses.some(
        response => String(response.value).length > +vr.value
      );

    default:
      console.log("error: rule type does not match");
      return false;
  }

}

function evaluateValidationRules(q, lang) {
  let errorNotifications = [];

  if (q.validationRules) {
    q.validationRules.forEach(vr => {
      if (vr.enabled) {
        // dont validate until you have a response to validate against
        if (q.result) {
          // make sure the validation value exist to validate against
          if (vr.value) {
            if (!isValidRule(q, vr)) {
              errorNotifications.push(buildNotificationObject(q,vr.errorMessage[lang],"mdi-message-draw",lang));
            }
          } else {
            console.log("error: validation rule value is null");
          }
        }
      }
    });
  }
  return errorNotifications;
}

function getQuestionErrorNotifications(q, lang)
{
   if (q.isVisible) {
    if (isValidationRequired(q)) {
        let errorNotifications = []
        //if question has no response, add a "required" error notification
        if(isEmptyValues(q.result) || isEmptyValues(q.result.responses)) {
          const errorMsg = i18n.t("app.notifications.question")
          errorNotifications.push(buildNotificationObject(q, errorMsg, 'mdi-message-draw', lang))
        } else {
          //else question has a response.
          
          //get notification errors for validation rules
          errorNotifications = errorNotifications.concat(evaluateValidationRules(q, lang));
          //get notification errors for  supplementary info
          errorNotifications = errorNotifications.concat(validateResponseOptions(q, lang))
       
        }

        return errorNotifications
      }
    
    //validate children questions 
    if(q.childQuestions && q.childQuestions.length > 0) {
      q.childQuestions.forEach(child => {
        getQuestionErrorNotifications(child, lang);
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

