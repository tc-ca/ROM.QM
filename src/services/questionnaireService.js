
  /* eslint-disable no-undef */

  let XrmWebApi = {
 //todo remove hardcoded guid
  //should by named template or questionnaire??
  GetQuestionnaireById: async function () {
    let data = '';
    await Xrm.WebApi.online
      .retrieveRecord(
        "qm_sytemplate",
        "893bcfb7-49f1-4c2f-8cf5-a412893fb229",
        "?$select=qm_templatejsontxt"
      )
      .then(
        function success(result) {
          var qm_templatejsontxt = result["qm_templatejsontxt"];
           data = JSON.parse(qm_templatejsontxt);
           alert(JSON.stringify(data))
        },
        function(error) {
          Xrm.Utility.alertDialog(error.message);
        }
      );
    return data;
  },

  SaveTemplate: async function (jsonObject) {
    let data = null;
    var entity = {};
    entity.qm_templatejsontxt = JSON.stringify(jsonObject);

    alert("trying to save" + JSON.stringify(entity.qm_templatejsontxt));
    await Xrm.WebApi.online
      .updateRecord(
        "qm_sytemplate",
        "893bcfb7-49f1-4c2f-8cf5-a412893fb229",
        entity
      )
      .then(
        function success(result) {
          data = result.id;
          alert('success: ' + data)
        },
        function(error) {
          Xrm.Utility.alertDialog(error.message);
        }
      );
    return data;
  },

  GetGlobalContext: async function () {  

    //alert(JSON.stringify(QMSDK.formExecutionContext,null))

    var context = Xrm.Utility.getGlobalContext()

    alert(JSON.stringify(context, null))

		var client = Xrm.Internal.isUci() ? 'UCI' : 'Web';
		var clientName = Xrm.Utility.getGlobalContext().client.getClient();
    var userId = Xrm.Utility.getGlobalContext().userSettings.userId;
    
    alert(JSON.stringify(client, null))
    alert(JSON.stringify(clientName, null))
    alert(JSON.stringify(userId, null))



    // var formContext = executionContext.getFormContext();  

    // var templateIdAttribute = formContext.getAttribute("qm_templateId");

    // alert(formContext);
    // alert(templateIdAttribute);

    // //check for customer  
    // if (templateIdAttribute != null &&  
    //   templateIdAttribute.getValue() != null) {  

    //     var templateId = templateIdAttribute.getValue()[0].id;  

    //     alert(templateId);
    // }  
  }  

}
  
export {
  XrmWebApi
};
