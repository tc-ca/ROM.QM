
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
////<reference path="../../Utilities/GlobalHelper.js"/>

// Not in use, just an example

var ServiceTaskMainForm = (function (window, document) {

    //variables
    
        var globalContext;
        var formType;
        var renderParams = {};
        var filterTaskType = "";
        var taskType = {};
        var savedTaskType = {};
        var ttKey = "tasktypeLkp";
        var webResourceControl;
    
    
    //********************private methods*******************
    
        function changeControlsBaseOnTaskType(formContext) {
    
            if (formType == 1
                || taskType.getValue() == undefined
                || taskType.getValue() == null)
                glHelper.SetSectionVisibility(formContext, "ServiceTaskGeneralTab", "questionnare_section", false);
    
            else glHelper.SetSectionVisibility(formContext, "ServiceTaskGeneralTab", "questionnare_section", true);
        }
    
        function LoadQuestionnaire(renderParams) {
            renderParams.webResourceControl.getContentWindow().then(function (win) {
                win.InitialContext(renderParams.executionContext);
                win.InitializeQuestionnaireRender(renderParams);
            });
        }
    
        function CompleteQuestionnaire(eContext, wrCtrl) {
            // Get the web resource inner content window
            wrCtrl.getContentWindow().then(function (win) {
                var userInput = win.DoComplete(eContext, glHelper.GetCurrentRecordId(eContext.getFormContext()), false);
            });
        }
    
        function getUtilizedTaskTypesSetPreFilter(formContext) {
    
    
            var clientContext = Xrm.Utility.getGlobalContext().client;
    
            if (clientContext.isOffline()) { }
            else { }
    
            filterTaskType = "<filter type='and'><condition attribute='msdyn_servicetasktypeid' operator='not-in'>{0}</condition>";
            var conditionTemplate = "<value>{0}</value>";
            var condition = "";
            var taskTypeCtrl = formContext.getControl("msdyn_tasktype");
            taskTypeCtrl.removePreSearch(ServiceTaskMainForm.AddTaskTypeFilter);
    
            //get all ServiceTaskTypes exist for the current WO
            var parentWO = glHelper.GetValue(formContext, "msdyn_workorder");
            //msdyn_workorder
            if (parentWO[0] != undefined && parentWO[0] != null) {
    
                Xrm.WebApi.online.retrieveMultipleRecords("msdyn_workorderservicetask", "?$select=_msdyn_tasktype_value,_msdyn_workorder_value,msdyn_workorderservicetaskid&$filter=_msdyn_workorder_value eq " + parentWO[0].id).then(
                    function success(results) {
    
                        if (results.entities.length == 0) {
    
                            filterTaskType = "";
                            //remove pre-filter
                            taskTypeCtrl.removePreSearch(ServiceTaskMainForm.AddTaskTypeFilter);
                        }
                        else {
    
                            for (var i = 0; i < results.entities.length; i++) {
                                var _msdyn_tasktype_value = results.entities[i]["_msdyn_tasktype_value"];
    
                                condition += conditionTemplate.replace("{0}", _msdyn_tasktype_value);
                            }
    
                            filterTaskType = filterTaskType.replace("{0}", condition) + "</filter>";
    
                            //add pre-filter
                            taskTypeCtrl.addPreSearch(ServiceTaskMainForm.AddTaskTypeFilter);
                        }
                    },
                    function (error) {
                        Xrm.Utility.alertDialog(error.message);
                        taskTypeCtrl.removePreSearch(ServiceTaskMainForm.AddTaskTypeFilter);
                    }
                );
            } else taskTypeCtrl.removePreSearch(ServiceTaskMainForm.AddTaskTypeFilter);
        }
    
        function lkpObjBackUp(lkp, obj) {
    
            var ts = lkp.getValue();
            if (ts != undefined && ts != null) {
    
                obj.entityType = ts[0].entityType;
                obj.id = ts[0].id;
                obj.name = ts[0].name;
            } else obj = undefined;
        }
    
    //********************private methods end***************
    
    
    //********************public methods*******************
    
        return {
    
            OnLoad: function (executionContext) {
    
    
                //get context
                globalContext = glHelper.getGlobalContext();
                var formContext = executionContext.getFormContext();
                formType = glHelper.GetFormType(formContext);
    
                //setup filter params and add pre-filter if necessery
                getUtilizedTaskTypesSetPreFilter(formContext);
    
                //add handlers and bk
                taskType = formContext.getAttribute("msdyn_tasktype");            
                taskType.addOnChange(ServiceTaskMainForm.OnTaskTypeChange);
                //back up current task tpe
                lkpObjBackUp(taskType, savedTaskType);
               
                executionContext.setSharedVariable(ttKey, taskType);
                changeControlsBaseOnTaskType(formContext, executionContext);
    
                // Get the web resource control on the form
                webResourceControl = formContext.getControl('WebResource_Questionnaire');
    
                //grab the JSON from the hidden field on the form
                var resultjson = formContext.getAttribute('ovs_questionnaireresultjson').getValue();
                var templateid = formContext.getAttribute('ovs_questionnairetemplateid').getValue();
    
    
                renderParams = {
                    executionContext: executionContext,
                    webResourceControl: webResourceControl,
                    resultjson: resultjson,
                    formType: formType,
                    userGuid: glHelper.GetCurrentUserId(),
                    userName: glHelper.GetCurrentUserName(),
                    userLang: glHelper.GetCurrentUserLanguage(),
                    serviceTaskId: glHelper.GetCurrentRecordId(formContext),
                    templateid: templateid,
                }
    
                LoadQuestionnaire(renderParams);
    
            },
    
            OnSave: function (executionContext) {
    
                var formContext = executionContext.getFormContext();
    
                if (formType == 2) {
    
                    // Get the web resource control on the form
                    var webResourceControl = formContext.getControl('WebResource_Questionnaire');
    
                    if (webResourceControl.getVisible() === false) {
                        return;
                    }
    
                    // Get the web resource inner content window
                    CompleteQuestionnaire(executionContext, webResourceControl);
                }
            },
    
            OnTaskTypeChange: function (executionContext) {
    
                var formContext = executionContext.getFormContext();
                //if new value
                if (formType != 1 && savedTaskType != undefined && savedTaskType != null) {
    
                    var confirmStrings = { text: "If Task Type is changed the whole Questionnaire progress will be lost. Proceed?", title: "Confirmation Dialog" };
                    var confirmOptions = { height: 200, width: 450 };
                    Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
                        function (success) {
                            //update questionnare
                            if (success.confirmed) {
    
                                taskType = formContext.getAttribute("msdyn_tasktype");   
                                lkpObjBackUp(taskType, savedTaskType);
    
                                formContext.getAttribute('ovs_questionnaireresultjson').setValue(null);
                                renderParams.resultjson = "";
                                LoadQuestionnaire(renderParams);
    
                                getUtilizedTaskTypesSetPreFilter(formContext);
    
                                var src = webResourceControl.getSrc();
                                webResourceControl.setSrc("about:blank");
                                setTimeout(function () {
                                    webResourceControl.setSrc(src);
                                }, 500);
    
                            }
                            //restore tasktype  value
                            else
                                glHelper.SetLookup(formContext, "msdyn_tasktype", savedTaskType.entityType, savedTaskType.id, savedTaskType.name);
                            
                        },
                        function (error) {
    
                            console.log(error.message);
                        }
                    );
                }
    
                changeControlsBaseOnTaskType(formContext, executionContext);
    
            },
    
            AddTaskTypeFilter: function (executionContext) {
    
                var formContext = executionContext.getFormContext();
                formContext.getControl("msdyn_tasktype").addCustomFilter(filterTaskType, "msdyn_servicetasktype");
            },
    
        };
    
    //********************public methods end***************
    
    })(window, document);