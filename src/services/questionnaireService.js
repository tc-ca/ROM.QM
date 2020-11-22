
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
           console.log(JSON.stringify(data))
        },
        function(error) {
          Xrm.Utility.alertDialog(error.message);
        }
      );
    return data;
  },

  SaveTemplate: async function (template) {
    let data = null;
    var entity = {};
    var templateid = template.templateid;
    entity.qm_templatejsontxt = JSON.stringify(template);

    console.log("trying to save" + JSON.stringify(entity.qm_templatejsontxt));
    await Xrm.WebApi.online
      .updateRecord(
        "qm_sytemplate",
        templateid,
        entity
      )
      .then(
        function success(result) {
          data = result.id;
          console.log('success: ' + data)
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

    console.log(JSON.stringify(context, null))

		var client = Xrm.Internal.isUci() ? 'UCI' : 'Web';
		var clientName = Xrm.Utility.getGlobalContext().client.getClient();
    var userId = Xrm.Utility.getGlobalContext().userSettings.userId;
    
    console.log(JSON.stringify(client, null))
    console.log(JSON.stringify(clientName, null))
    console.log(JSON.stringify(userId, null))

  }  

}
  
export {
  XrmWebApi
};
