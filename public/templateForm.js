"use strict";
var ROM;
(function (ROM) {
    var TemplateForm;
    (function (TemplateForm) {

        //////////////////////
        /////VARIABLES
        ////////////////////////
        var mode = '';
        var builderTabName = 'tab_2';


        ///////////////////////////////////////////////
        /////FORM LOAD
        ///////////////////////////////////////////////
        function OnDynamicsFormLoad(eContext) {
            var Form = eContext.getFormContext();

            //hide the builder tab if this is a new template
            var recordGuid = Form.data.entity.getId();
            if (!recordGuid) {
                // Exit if no questionnaire exists
                hideTab(eContext, 'tab_2', false);
                return;
            }
            else {
                hideTab(eContext, 'tab_2', true);
            }

            // Get the web resource control on the form
            var webResourceControl = Form.getControl('WebResource_BuilderTemplateForm');

            //grab the JSON from the hidden field on the form
            var templatejson = Form.getAttribute('qm_templatejsontxt').getValue();
            
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
                executionContext: eContext,
                webResourceControl: webResourceControl, 
                templatejson: templatejson, 
                formType: formType,
                userGuid: userGuid, 
                userName: userName, 
                userLang: userLang, 
                templateId: recordGuid
            }

            LoadQuestionnaire(dynParams);
        }
        TemplateForm.OnDynamicsFormLoad = OnDynamicsFormLoad;
        
        /////////////////////////////////////////////////////
        ////CALLED ON FORM LOAD "OnDynamicsFormLoad()"
        /////////////////////////////////////////////////////
        function LoadQuestionnaire(dynParams) {
            hideTab(dynParams.executionContext, builderTabName, true);

            dynParams.webResourceControl.getContentWindow().then(function (win) {
                win.InitialContext(dynParams.executionContext);
                win.InitializeQuestionnaireBuilder(dynParams);
            });
        }


        ///////////////////////////////////////////////
        /////FORM SAVE
        ///////////////////////////////////////////////
        function OnDynamicsFormSave(eContext) {
            // Get formContext
            var Form = eContext.getFormContext();
            // Get the web resource control on the form
            var webResourceControl = Form.getControl('WebResource_BuilderTemplateForm');

            if (webResourceControl.getVisible() === false) {
                return;
            }
            
            // Get the web resource inner content window
            CompleteQuestionnaire(eContext, webResourceControl);
        }
        TemplateForm.OnDynamicsFormSave = OnDynamicsFormSave;


    })(TemplateForm = ROM.TemplateForm || (ROM.TemplateForm = {}));
})(ROM || (ROM = {}));

function CompleteQuestionnaire(eContext, wrCtrl) {
    // Get the web resource inner content window
    wrCtrl.getContentWindow().then(function (win) {
            var Form = eContext.getFormContext();

            //hide the builder tab if this is a new template
            var recordGuid = Form.data.entity.getId();
            alert('from template form '+recordGuid)
        var userInput = win.DoComplete(eContext, recordGuid);
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