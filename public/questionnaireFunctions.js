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

  const template = await GetTemplateById(templateId);

  questionnaireVueInstance.Render(
    template,
  );

  const legs = await GetLegislations();
  questionnaireVueInstance.SetLegislations(
    legs,
  )
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
  if (!resultJSON || resultJSON === 'null') {
    //get json to render
    let template = await getTemplateDataByServiceTaskId(serviceTaskId);
    //set the questionnaire state for the app to display json questionnaire
    questionnaireVueInstance.Render(template);
    return;
  }
  else{
        alert("in the else");
        // get json to render
        const questionnaire = JSON.parse(resultJSON);
        //set the questionnaire state for the app to display json questionnaire
        questionnaireVueInstance.Render(questionnaire);

        const legs = await GetLegislations();
        questionnaireVueInstance.SetLegislations(
          legs,
        );
      }
}

function SaveAnswers(userInput) {
  var data = JSON.stringify(userInput.data, null, 3);
  window.parentFormContext.getAttribute("qm_templatejsontxt").setValue(data);
}

const surveyValueChanged = function(sender, options) {
  const el = document.getElementById(options.name);
  if (el) {
    el.value = options.value;
  else {
    // get json to render
    const questionnaire = JSON.parse(resultJSON);
    //set the questionnaire state for the app to display json questionnaire
    questionnaireVueInstance.Render(questionnaire);
  }
}

async function DoComplete(eContext, recordGuid, isBuilderPage = false) {
  var questionnaireVueInstance = document
    .querySelector("questionnaire-builder")
    .getVueInstance();

  //save what we have in state
  //get questionnaire from state
  //pass to dynamics
  if (isBuilderPage) {
    const questionnaire = questionnaireVueInstance.GetState();
    const result = await SaveQuestionnaireTemplate(questionnaire, recordGuid);
  }
  else {
    //////////////////////////////////
    ////RECORDGUID = SERVICE TASK ID
    //////////////////////////////////
    const questionnaire = questionnaireVueInstance.GetState();
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

function GetLegislations() {  
  var req = new XMLHttpRequest();
  req.open("POST", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/ovs_LegislationsGet", true);
  req.setRequestHeader("OData-MaxVersion", "4.0");
  req.setRequestHeader("OData-Version", "4.0");
  req.setRequestHeader("Accept", "application/json");
  req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  req.onreadystatechange = function() {
      if (this.readyState === 4) {
          req.onreadystatechange = null;
          if (this.status === 200) {
              return JSON.parse(this.response);
              // localStorage.setItem('legislations-data', results.jsonResult)
          } else {
              Xrm.Utility.alertDialog(this.statusText);
          }
      }
  };
  req.send();  
}

async function getTemplateDataByServiceTaskId(serviceTaskId) {
  let data = null;
  var serviceTaskTypeId = null;
  var templateJson = null;
  await Xrm.WebApi.online.retrieveRecord("msdyn_workorderservicetask", serviceTaskId, "?$select=msdyn_name,ovs_questionnaireresultjson&$expand=msdyn_tasktype($select=msdyn_name,msdyn_servicetasktypeid)").then(
    function success(result) {
        data = result["ovs_questionnaireresultjson"];

        if (result.hasOwnProperty("msdyn_tasktype")) {
          serviceTaskTypeId = result["msdyn_tasktype"]["msdyn_servicetasktypeid"];
        }
    },
    function(error) {
        Xrm.Utility.alertDialog(error.message);
    }
  ).then(function(){
    if (data == null || data === "null"){
      data = GetTemplateByServiceTaskType(serviceTaskTypeId);
    }
  });

  return data;
}

async function GetTemplateByServiceTaskType(serviceTaskTypeId){
  let data = null;
  await Xrm.WebApi.online.retrieveRecord("msdyn_servicetasktype", serviceTaskTypeId, "?$select=msdyn_name&$expand=ovs_QuestionnaireTemplate($select=qm_sytemplateid,qm_templatejsontxt)").then(
    function success(result) {
        var msdyn_name = result["msdyn_name"];
        if (result.hasOwnProperty("ovs_QuestionnaireTemplate")) {
            var ovs_QuestionnaireTemplate_qm_sytemplateid = result["ovs_QuestionnaireTemplate"]["qm_sytemplateid"];
            var templateJson  = result["ovs_QuestionnaireTemplate"]["qm_templatejsontxt"];
            data = JSON.parse(templateJson) ;
        }
    },
    function(error) {
        Xrm.Utility.alertDialog(error.message);
    }
  );
  return data;
}

async function GetTemplateById(id) {
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

async function SaveQuestionnaireTemplate(questionnaire, id) {
  let data = null;
  var entity = {};
  entity.qm_templatejsontxt = JSON.stringify(questionnaire);
  console.log("saving id: " + id);
  console.log("saving json: " + JSON.stringify(questionnaire));
  await Xrm.WebApi.online.updateRecord("qm_sytemplate", id, entity).then(
    function success(result) {
      data = result.id;
      DisplayGlobalNotification('Questionnaire Template Saved Successfully', 1);
    },
    function(error) {
      Xrm.Utility.alertDialog(error.message);
    }
  );
  return data;
}

async function SaveQuestionnaire(questionnaireResult, serviceTaskId){
  let updatedServiceTaskId = null;
  var serviceTask = {};

  /////////////////////////////////////////////////////
  ////MUST BE SIMPLE STRING, CANT BE COMPLEX OBJECT
  /////////////////////////////////////////////////////
  serviceTask.ovs_questionnaireresultjson = JSON.stringify(questionnaireResult);
  
  await Xrm.WebApi.online.updateRecord("msdyn_workorderservicetask", serviceTaskId, serviceTask).then(
      function success(result) {
          updatedServiceTaskId = result.id;
          DisplayFormNotification('Questionnaire Saved Successfully', "INFO");
      },
      function(error) {
          Xrm.Utility.alertDialog(error.message);
      }
  );

  return updatedServiceTaskId;
}



/**
 * 
 * @param {MESSAGE TO THE USER} message 
 * @param {TYPE OF NOTIFICATION ["INFO", "WARNING", "ERROR"]} type 
 * @param {TIME IN MS TO CLEAR NOTIFICATION [DEFAULT 5 SECONDS]} timeout 
 */
function DisplayFormNotification(message, type, timeout=3000) {
  //UNIQUE ID FOR THIS NOTIFICATION. 
  //ID IS USED TO LATER CLOSE THIS SPECIFIC NOTIFICATION
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  var id = randLetter + Date.now();

  //DISPLAY THE NOTIFICATION
  Xrm.Page.ui.setFormNotification(message, type, id);

  //WAIT, AND CLEAR
  setTimeout(
      function () {
          Xrm.Page.ui.clearFormNotification(id);
      },
      timeout
  );
}



/**
 * 
 * @param {MESSAGE TO THE USER} message 
 * @param {TYPE OF NOTIFICATION [1: SUCCESS, 2: ERROR, 3: WARNING, 4: INFORMATION ]} type 
 * @param {TIME IN MS TO CLEAR NOTIFICATION [DEFAULT 5 SECONDS]} timeout 
 * @param {ACTION FUNCTION TO PERFORM WHEN NOTIFICATION CLICKED 
 * var myAction = 
 * {
 *    actionLabel: "Click here to Submit", 
 *    eventHandler: function () {
 *      Xrm.Navigation.openUrl("https://soundharyasubhash.wordpress.com");
 *      // perform other operations as required on clicking
 *    }
 * }
 *} action
 */
function DisplayGlobalNotification(message, type, timeout=3000, action=null){
    // DEFINE NOTIFICATION OBJECT
    var notification = 
    {
      type: 2,
      level: type, // Information
      message: message
    }

    //ADD ACTION IF DEFINED
    if (!action) notification.action = action;

    //SHOW GLOBAL NOTIFICATION
    Xrm.App.addGlobalNotification(notification).then(

      function success(result) {
        console.log("Notification created with ID: " + result);

        // Wait for 5 seconds and then clear the notification
        window.setTimeout(function () { 
          Xrm.App.clearGlobalNotification(result); 
        }, timeout);

      },

      function (error) {
        console.log(error.message);
        // handle error conditions
      }
  );
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
