/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';
window.parentExecutionContext = null;
window.parentFormContext = null;

function InitialContext(executionContext) {
  window.parentExecutionContext = executionContext;
  window.parentFormContext = executionContext.getFormContext();
}

function InitializeQuestionnaireBuilder (dynParams) {

  let executionContext    = dynParams.executionContext;
  let webResourceControl  = dynParams.webResourceControl;
  let templateJson        = dynParams.templateJson;
  let formType            = dynParams.formType;
  let userGuid            = dynParams.userGuid;
  let userName            = dynParams.userName;
  let userLang            = dynParams.userLang;
  let templateId          = dynParams.templateId;

  // if the template has some json we will render it by passing value to prop of Vue app
  //by setting attribute on the element which has a watch event to detect changes.
 if (templateJson !== null) {
      let questionnaire = document.getElementsByTagName(
        "questionnaire-builder"
      )[0];
      // set the attribute
      questionnaire.setAttribute("schema", templateJson);
  }

  // Xrm.Utility.alertDialog("formType: " + formType);
  // Xrm.Utility.alertDialog("templateJSON: " + templateJson);
  // Xrm.Utility.alertDialog("templateId: " + templateId);
  // Xrm.Utility.alertDialog("userGuid: " + userGuid);
  // Xrm.Utility.alertDialog("userName: " + userName);
  // Xrm.Utility.alertDialog("userLang: " + userLang);

  //TODO: on save stick json into the attribute of the form




  // if (surveyResponse != null) {
  //   survey.data = JSON.parse(surveyResponse);
  // }

  // survey.onComplete.add(function (result) {
  //   SaveAnswers(result);
  // });

  // $('#surveyElement').Survey({
  //   model: survey,
  //   onValueChanged: surveyValueChanged,
  // });

  // $('.sv-btn.sv-footer__complete-btn').hide();
}

function SaveAnswers(userInput) {
  var data = JSON.stringify(userInput.data, null, 3);
  window.parentFormContext.getAttribute('qm_templatejsontxt').setValue(data);
}

const surveyValueChanged = function (sender, options) {
  const el = document.getElementById(options.name);
  if (el) {
    el.value = options.value;
  }
};

function DoComplete() {
  alert('SAVE');
}
// const createAnnotation = function (regarding, fileInfo, documentBody) {
//   /// <param name='regrding' type='MobileCRM.Refernce'/>
//   /// <param name='fileInfo' type='MobileCRM.Settings._fileInfo'/>
//   /// <param name='documentBody' type='base64'>File base 64 string.<param>

//   var note = {
//     filename: 'PDFReport.pdf',
//     mimetype: 'application/pdf',
//     isdocument: true,
//     documentbody: documentBody.slice(documentBody.indexOf(',') + 1) || ' ',
//     subject: 'PDF report doucment',
//     notetext: 'Survey JS questionnaire PDF report',
//     'objectid_tc_tcinspection@odata.bind': '/tc_tcinspections(' + regarding + ')',
//   };

//   parent.Xrm.WebApi.createRecord('annotation', note).then(
//     function success(result) {
//       console.log('Document saved: ' + result.id);
//       // perform operations on record creation
//     },
//     function (error) {
//       console.log(error.message);
//       // handle error conditions
//     }
//   );
// };

// function SavePDF(text) {
//   createAnnotation(tc_tcinspectionid.replace(/[{}]/g, ''), 'PDFReport.pdf', text);
//   return true;
// }
