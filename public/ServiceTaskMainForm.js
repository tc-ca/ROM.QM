/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
var ServiceTaskForm = (function (window, document) {

    //********************private methods*******************
    
    
    //********************private methods end***************
    
    
    
    //********************public methods*******************
    
        return {
    
            OnLoad: function (executionContext) {
    
                console.log("ONLOAD");
    
                var Form = executionContext.getFormContext();
    
                var recordGuid = Form.data.entity.getId();
    
                //add handler for changing the task type
                Form.getAttribute("msdyn_tasktype").addOnChange(OnTaskTypeChange);
    
                //hide the questionnaire control if this is a new service task
                if (!recordGuid) {
                    SetSectionVisibility(Form, "{1932b377-2e7e-4880-9b0e-477cc529b5fe}", "questionnare_section", false);
                    return;
                }
                else {
                    SetSectionVisibility(Form, "{1932b377-2e7e-4880-9b0e-477cc529b5fe}", "questionnare_section", true);
                }
    
                // Get the web resource control on the form
                var webResourceControl = Form.getControl('WebResource_Questionnaire');
    
                //grab the JSON from the hidden field on the form
                var resultjson = Form.getAttribute('ovs_questionnaireresultjson').getValue();
                var templateid   = Form.getAttribute('ovs_questionnairetemplateid').getValue();
                 
                // 0 = Undefined, 1 = Create, 2 = Update, 3 = Read Only, 4 = Disabled, 6 = Bulk Edit
                var formType = Form.ui.getFormType(); 
    
                // get the guid id of the current user 
                var userGuid = Form.context.getUserId();
    
                // get the username of the current user
                var userName = Form.context.userSettings.userName;
                
                // get the language of the current user  
                var userLang = getUserLang();
    
                //build array of params to pass down to the questionnaire component
                var dynParams = {
                    executionContext: executionContext,
                    webResourceControl: webResourceControl, 
                    resultjson: resultjson, 
                    formType: formType,
                    userGuid: userGuid, 
                    userName: userName, 
                    userLang: userLang, 
                    serviceTaskId: recordGuid, 
                    templateid: templateid, 
                    xrm: Xrm
                }
    
                LoadQuestionnaire(dynParams);
            },
    
            OnSave: function (executionContext) {
                console.log("ONSAVE");  
            }
    
        };
    
        function GetLookupName(formContext, attr) {
            var lu = formContext.getAttribute(attr);
            if (lu != null) {
                if (lu.getValue() != null && lu.getValue().length > 0) {
                    var luValue = lu.getValue();
                    if (luValue != null) {
                        return luValue[0].name;
                    }
                }
                else {
                    return "";
                }
            }
            return "";
        }
    
        function SetSectionVisibility(formContext, tabname, sectionname, visible) {
            var tab = formContext.ui.tabs.get(tabname);
            var section = tab.sections.get(sectionname);
            section.setVisible(visible);
        }
    
        function changeControlsBaseOnTaskType(formContext, executionContext) {
            console.log("changeControlsBaseOnTaskType");
          
            var recordGuid = formContext.data.entity.getId();

            //hide the questionnaire control if this is a new service task
            if (!recordGuid || !GetLookupName(formContext, "msdyn_tasktype")) {
                SetSectionVisibility(formContext, "{1932b377-2e7e-4880-9b0e-477cc529b5fe}", "questionnare_section", false);
                return;
            }
            else {
                SetSectionVisibility(formContext, "{1932b377-2e7e-4880-9b0e-477cc529b5fe}", "questionnare_section", true);
            }
        }
          
          function OnTaskTypeChange(executionContext) {
          
            console.log("ONTASKTYPECHANGE");
          
            var formContext = executionContext.getFormContext();
            
            changeControlsBaseOnTaskType(formContext, executionContext);
          
            //fetchQuestionnaire(formContext, executionContext);
          }
    
        /////////////////////////////////////////////////////
        ////CALLED ON FORM LOAD "OnDynamicsFormLoad()"
        /////////////////////////////////////////////////////
        function LoadQuestionnaire(renderParams) {
            renderParams.webResourceControl.getContentWindow().then(function (win) {
                win.InitialContext(renderParams.executionContext);
                win.InitializeQuestionnaireRender(renderParams);
            });
        }
    
        function CompleteQuestionnaire(eContext, wrCtrl) {
            // Get the web resource inner content window
            wrCtrl.getContentWindow().then(function (win) {
                var userInput = win.DoComplete(eContext);
            });
        }
        
        function hideTab(eContext, tabname, hideorshow) {
            var formContext = eContext.getFormContext();
            var tabObj = formContext.ui.tabs.get(tabname);
            tabObj.setVisible(hideorshow);
        }
        
        // Get dynamics language
        function getUserLang() {
            var languageCode = Xrm.Utility.getGlobalContext().userSettings.languageId;
            var surveyLocale = 'en';
            if (languageCode == 1036) {
                //French
                surveyLocale = 'fr';
            }
            return surveyLocale;
        }
    
    //********************public methods end***************
    
    })(window, document);
    
    
    