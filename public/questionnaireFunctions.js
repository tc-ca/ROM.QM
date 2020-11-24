/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';
window.parentExecutionContext = null;
window.parentFormContext = null;

function InitialContext(executionContext) {
  window.parentExecutionContext = executionContext;
  window.parentFormContext = executionContext.getFormContext();
}

async function InitializeQuestionnaireBuilder(dynParams) {
  let executionContext = dynParams.executionContext;
  let webResourceControl = dynParams.webResourceControl;
  let templatejson = dynParams.templatejson;
  let formType = dynParams.formType;
  let userGuid = dynParams.userGuid;
  let userName = dynParams.userName;
  let userLang = dynParams.userLang;
  let templateId = dynParams.templateId;

  var questionnaireVueInstance = document
    .querySelector("questionnaire-builder")
    .getVueInstance();

  const questionnaireJson = await GetQuestionnaireById(templateId);
  alert("from dynamics: " + JSON.stringify(questionnaireJson));

  //need to pass id and template separate because on new, json questionnaire wont have an id on it.
  questionnaireVueInstance.GetAndSetQuestionnaireState(
    questionnaireJson,
    templateId
  );
}

async function InitializeQuestionnaireRender(dynParams) {
  let executionContext = dynParams.executionContext;
  let webResourceControl = dynParams.webResourceControl;
  let resultJSON = dynParams.resultjson;
  let formType = dynParams.formType;
  let userGuid = dynParams.userGuid;
  let userName = dynParams.userName;
  let userLang = dynParams.userLang;
  let questionnaireId = dynParams.templateId;
  let serviceTaskId = dynParams.serviceTaskId;
  let xrm = dynParams.xrm;
  let msdyn_TaskType = dynParams.msdyn_TaskType;

  console.log("formType: " + formType);
  console.log("templateId: " + questionnaireId);
  console.log("userGuid: " + userGuid);
  console.log("userName: " + userName);
  console.log("userLang: " + userLang);
  console.log("serviceTaskId: " + serviceTaskId);

  var questionnaireVueInstance = document
    .querySelector("questionnaire-builder")
    .getVueInstance();

  if (formType > 1) {
    //Xrm.Utility.alertDialog("EXISTING QUESTIONNAIRE");
    console.log("EXISTING QUESTIONNAIRE");
  } else {
    //Xrm.Utility.alertDialog("NEW QUESTIONNAIRE");
    console.log("NEW QUESTIONNAIRE");
  }

  // we're not showing the render form if this is a new service task
  // user must select the service task type first
  if (!serviceTaskId) {
    return;
  }

  //no result, so we have to load the base template from the templateId
  if (!resultJSON) {

    const {questionnaire, questionnaireId} = await getTemplateDataByServiceTaskId( xrm,serviceTaskId);
    //need to pass id and template separate because on new, json questionnaire wont have an id on it.
    questionnaireVueInstance.GetAndSetQuestionnaireState(
      questionnaire,
      questionnaireId
    );
    return;
  }
  else{
    alert('in the else')
    const questionnaire = JSON.parse(resultJSON);
        questionnaireVueInstance.GetAndSetQuestionnaireState(
          questionnaire,
          questionnaireId
        );
  }

  let render = document.getElementsByTagName("questionnaire-builder")[0];
  // set the prop values on our vue control
  render.setAttribute("templatejson", resultJSON);
  render.setAttribute("templateid", questionnaireId);
  render.setAttribute("page", "questionnaire");
}

function SaveAnswers(userInput) {
  var data = JSON.stringify(userInput.data, null, 3);
  window.parentFormContext.getAttribute("qm_templatejsontxt").setValue(data);
}

const surveyValueChanged = function(sender, options) {
  const el = document.getElementById(options.name);
  if (el) {
    el.value = options.value;
  }
};

async function DoComplete(eContext, recordGuid, isBuilderPage) {
  alert('do complete')
  var questionnaireVueInstance = document
    .querySelector("questionnaire-builder")
    .getVueInstance();

  //save what we have in state
  //get questionnaire from state
  //pass to dynamics
  if (isBuilderPage) {
    const questionnaire = questionnaireVueInstance.GetAndSetQuestionnaireState();
    alert(JSON.stringify(questionnaire))
    const result = await SaveQuestionnaire(questionnaire, recordGuid);
  }
  else {
    const questionnaire = questionnaireVueInstance.GetAndSetQuestionnaireState();
    alert(JSON.stringify(questionnaire))
    const result = await SaveQuestionnaire(questionnaire, recordGuid);
  }
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

async function getTemplateDataByServiceTaskId(xrm, serviceTaskId) {
  let data = null;

  await Xrm.WebApi.online
    .retrieveRecord(
      "msdyn_workorderservicetask",
      serviceTaskId,
      "?$select=msdyn_name&$expand=msdyn_tasktype($select=msdyn_servicetasktypeid),ovs_questionnairetemplateid($select=qm_sytemplateid,qm_templatejsontxt)"
    )
    .then(
      function success(result) {
        if (result.hasOwnProperty("ovs_questionnairetemplateid")) {
          var templateId =
            result["ovs_questionnairetemplateid"]["qm_sytemplateid"];
          var template = JSON.parse(
            result["ovs_questionnairetemplateid"]["qm_templatejsontxt"]
          );
          data = { questionnaireId: templateId, questionnaire: template };
        }
      },
      function(error) {
        Xrm.Utility.alertDialog(error.message);
      }
    );
  return data;
}

async function GetQuestionnaireById(id) {
  let data = null;
  await Xrm.WebApi.online
    .retrieveRecord("qm_sytemplate", id, "?$select=qm_templatejsontxt")
    .then(
      function success(result) {
        var qm_templatejsontxt = result["qm_templatejsontxt"];
        data = JSON.parse(qm_templatejsontxt);
      },
      function(error) {
        Xrm.Utility.alertDialog(error.message);
      }
    );
  return data;
}

async function SaveQuestionnaire(questionnaire, id) {
  let data = null;
  var entity = {};
  entity.qm_templatejsontxt = JSON.stringify(questionnaire);
  alert("saving id: " + id);
  alert("saving json: " + JSON.stringify(questionnaire));
  await Xrm.WebApi.online.updateRecord("qm_sytemplate", id, entity).then(
    function success(result) {
      data = result.id;
      alert("success: " + data);
    },
    function(error) {
      alert("error" + error);
      Xrm.Utility.alertDialog(error.message);
    }
  );
  return data;
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
