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
  let templatejson        = dynParams.templatejson;
  let formType            = dynParams.formType;
  let userGuid            = dynParams.userGuid;
  let userName            = dynParams.userName;
  let userLang            = dynParams.userLang;
  let templateId          = dynParams.templateId;

  // if the template has some json we will render it by passing value to prop of Vue app
  //by setting attribute on the element which has a watch event to detect changes.
  let questionnaire = document.getElementsByTagName(
    "questionnaire-builder"
  )[0];
  // set the attribute
  questionnaire.setAttribute("templatejson", templatejson);
  questionnaire.setAttribute("templateid", templateId);

  // Xrm.Utility.alertDialog("formType: " + formType);
  // Xrm.Utility.alertDialog("templatejson: " + templatejson);
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

function InitializeQuestionnaireRender (dynParams) {
  let executionContext    = dynParams.executionContext;
  let webResourceControl  = dynParams.webResourceControl;
  let resultjson          = dynParams.resultjson;
  let formType            = dynParams.formType;
  let userGuid            = dynParams.userGuid;
  let userName            = dynParams.userName;
  let userLang            = dynParams.userLang;
  let templateId          = dynParams.templateId;
  let serviceTaskId       = dynParams.serviceTaskId;
  let xrm                 = dynParams.xrm;
  let msdyn_TaskType      = dynParams.msdyn_TaskType;

  console.log("formType: " + formType);
  console.log("templateId: " + templateId);
  console.log("userGuid: " + userGuid);
  console.log("userName: " + userName);
  console.log("userLang: " + userLang);
  console.log("serviceTaskId: " + serviceTaskId);

  if (formType > 1) {
    //Xrm.Utility.alertDialog("EXISTING QUESTIONNAIRE");
    console.log("EXISTING QUESTIONNAIRE")
  }
  else {
    //Xrm.Utility.alertDialog("NEW QUESTIONNAIRE");
    console.log("NEW QUESTIONNAIRE");
  }

  // we're not showing the render form if this is a new service task
  // user must select the service task type first
  if (!serviceTaskId) {
    return;
  }

  //pass this to the view prop, then view can deal with loading it 
  if (!resultjson)
  {
    //no result, so we have to load the base template from the templateId
    getTemplateIdByServiceTask(xrm, serviceTaskId);
    return;
  }

  let render = document.getElementsByTagName(
    "questionnaire-builder"
  )[0];
  // set the prop values on our vue control
  render.setAttribute("templatejson", resultjson);
  render.setAttribute("templateid", templateId);
  render.setAttribute("page", "questionnaire");
  
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

function DoComplete(eContext) {

}


function SetValue(formContext, attr, val) {
  formContext.getAttribute(attr).setValue(val);
  formContext.getAttribute(attr).setSubmitMode("always");
}

function SetLookup(formContext, attr, entitytype, id, name) {
  var setLookupValue = new Array();
  setLookupValue[0] = new Object();
  setLookupValue[0].id = id;
  setLookupValue[0].entityType = entitytype;
  setLookupValue[0].name = name;
  formContext.getAttribute(attr).setValue(setLookupValue);
  formContext.getAttribute(attr).setSubmitMode("always");
}

function SetOptionsetByText(formContext, attr, text) {
  var options = formContext.getAttribute(attr).getOptions();
  for (var i = 0; i < options.length; i++) {
      if (options[i].text == text) {
          formContext.getAttribute(attr).setValue(options[i].value);
          formContext.getAttribute(attr).setSubmitMode("always");
      }
  }
}

function SetOptionsetByValue(formContext, attr, intValue) {
  var oSet = formContext.getAttribute(attr);
  var options = oSet.getOptions();
  for (var i = 0; i < options.length; i++) {
      if (options[i].value == intValue) {
          oSet.setValue(options[i].value);
          oSet.setSubmitMode("always");
      }
  }
}

function getTemplateIdByServiceTask(xrm, serviceTaskId) {

  Xrm.WebApi.online.retrieveRecord("msdyn_workorderservicetask", serviceTaskId, "?$select=msdyn_name&$expand=msdyn_tasktype($select=msdyn_servicetasktypeid),ovs_questionnairetemplateid($select=qm_sytemplateid,qm_templatejsontxt)").then(
    function success(result) {
        if (result.hasOwnProperty("ovs_questionnairetemplateid")) {
            var templateId = result["ovs_questionnairetemplateid"]["qm_sytemplateid"];
            var templatejson = result["ovs_questionnairetemplateid"]["qm_templatejsontxt"];

            let render = document.getElementsByTagName("questionnaire-builder")[0];
            render.setAttribute("templatejson", templatejson);
            render.setAttribute("templateid", templateId);
        }
    },
    function(error) {
        Xrm.Utility.alertDialog(error.message);
    }

)}

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