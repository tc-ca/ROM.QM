/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */


var ServiceTaskForm = (function (window, document) {

    //variables
    var globalContext;

//********************private methods*******************
    function fetchQuestionnaire(formContext, executionContext) {
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/qm_sytemplates?fetchXml=%3Cfetch%3E%3Centity%20name%3D%22qm_sytemplate%22%3E%3Cattribute%20name%3D%22qm_sytemplateid%22%20alias%3D%22templateId%22%2F%3E%3Cattribute%20name%3D%22qm_name%22%20alias%3D%22templatePrimaryKey%22%2F%3E%3Cattribute%20name%3D%22qm_templatee%22%20alias%3D%22templateTitleEn%22%2F%3E%3Cattribute%20name%3D%22qm_templatef%22%20alias%3D%22templateTitleFr%22%2F%3E%3Clink-entity%20name%3D%22qm_sytemplate_sygroup%22%20from%3D%22qm_sytemplateid%22%20to%3D%22qm_sytemplateid%22%20link-type%3D%22inner%22%20alias%3D%22template_groups%22%20intersect%3D%22true%22%20%3E%3Clink-entity%20name%3D%22qm_sygroup%22%20from%3D%22qm_sygroupid%22%20to%3D%22qm_sygroupid%22%20link-type%3D%22outer%22%20alias%3D%22groups%22%20visible%3D%22true%22%20%3E%3Cattribute%20name%3D%22qm_groupf%22%20%2F%3E%3Cattribute%20name%3D%22qm_groupe%22%20%2F%3E%3Cattribute%20name%3D%22qm_name%22%20%2F%3E%3Cattribute%20name%3D%22qm_ordernbr%22%20%2F%3E%3Cattribute%20name%3D%22qm_isvisibleind%22%20%2F%3E%3Cattribute%20name%3D%22qm_sygroupid%22%20%2F%3E%3Corder%20attribute%3D%22qm_ordernbr%22%20%2F%3E%3Clink-entity%20name%3D%22qm_syquestion%22%20from%3D%22qm_sygroupid%22%20to%3D%22qm_sygroupid%22%20link-type%3D%22inner%22%20alias%3D%22questions%22%20visible%3D%22true%22%20%3E%3Cattribute%20name%3D%22qm_name%22%20%2F%3E%3Cattribute%20name%3D%22qm_questione%22%20%2F%3E%3Cattribute%20name%3D%22qm_questionf%22%20%2F%3E%3Cattribute%20name%3D%22qm_ordernbr%22%20%2F%3E%3Cattribute%20name%3D%22qm_isvisibleind%22%20%2F%3E%3Cattribute%20name%3D%22qm_questiontypecd%22%20%2F%3E%3Cattribute%20name%3D%22qm_syquestionid%22%20%2F%3E%3Cattribute%20name%3D%22qm_syquestionid_self%22%20%2F%3E%3Corder%20attribute%3D%22qm_ordernbr%22%20%2F%3E%3Clink-entity%20name%3D%22qm_syresponse%22%20from%3D%22qm_syquestionid%22%20to%3D%22qm_syquestionid%22%20link-type%3D%22outer%22%20alias%3D%22responses%22%20visible%3D%22true%22%20%3E%3Cattribute%20name%3D%22qm_name%22%20%2F%3E%3Cattribute%20name%3D%22qm_syresponseid%22%20%2F%3E%3Corder%20attribute%3D%22qm_name%22%20%2F%3E%3C%2Flink-entity%3E%3C%2Flink-entity%3E%3C%2Flink-entity%3E%3C%2Flink-entity%3E%3C%2Fentity%3E%3C%2Ffetch%3E", true);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var results = JSON.parse(this.response);
                } else {
                    Xrm.Utility.alertDialog(this.statusText);
                }
            }
        };
        req.send();
    }


//********************private methods end***************






//********************public methods*******************

    return {

        OnLoad: function (executionContext) {

            Xrm.Utility.alertDialog("ONLOAD");
            
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
            Xrm.Utility.alertDialog("ONSAVE");  
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

        Xrm.Utility.alertDialog("changeControlsBaseOnTaskType");
      
        //control msdyn_surveyboundedoutput
        if (GetLookupName(formContext, "msdyn_tasktype").indexOf("General Compliance") > -1) {
            SetSectionVisibility(formContext, "{1932b377-2e7e-4880-9b0e-477cc529b5fe}", "questionnare_section", true);
        } else {
            SetSectionVisibility(formContext, "{1932b377-2e7e-4880-9b0e-477cc529b5fe}", "questionnare_section", false);
        }
      }
      
      function OnTaskTypeChange(executionContext) {
      
        Xrm.Utility.alertDialog("ONTASKTYPECHANGE");
      
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