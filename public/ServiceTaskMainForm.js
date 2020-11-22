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

            //hide the builder tab if this is a new template
            if (!recordGuid) {
                // Exit if no questionnaire exists
                SetSectionVisibility(Form, "{1932b377-2e7e-4880-9b0e-477cc529b5fe}", "questionnare_section", false);
                return;
            }
            else {
                SetSectionVisibility(Form, "{1932b377-2e7e-4880-9b0e-477cc529b5fe}", "questionnare_section", true);
            }

            //add handlers
            Form.getAttribute("msdyn_tasktype").addOnChange(OnTaskTypeChange);

            // Get the web resource control on the form
            var webResourceControl = Form.getControl('WebResource_Questionnaire');

            LoadQuestionnaire(webResourceControl, executionContext, recordGuid);
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
      
        //control msdyn_surveyboundedoutput
        if (GetLookupName(formContext, "msdyn_tasktype").indexOf("General Compliance") > -1) {
            SetSectionVisibility(formContext, "{1932b377-2e7e-4880-9b0e-477cc529b5fe}", "questionnare_section", true);
        } else {
            SetSectionVisibility(formContext, "{1932b377-2e7e-4880-9b0e-477cc529b5fe}", "questionnare_section", false);
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
    function LoadQuestionnaire(webResourceControl, executionContext, recordGuid) {
        webResourceControl.getContentWindow().then(function (win) {
            win.InitialContext(executionContext);
            win.InitializeQuestionnaireRender(webResourceControl, executionContext, recordGuid);
        });
    }

//********************public methods end***************

})(window, document);