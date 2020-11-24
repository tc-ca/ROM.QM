
  /* eslint-disable no-undef */

  let XrmWebApi = {
 //todo remove hardcoded guid
  //should by named template or questionnaire??
  GetQuestionnaireById: async function (id) {
    let data = '';
    await Xrm.WebApi.online
      .retrieveRecord(
        "qm_sytemplate",
        id,
        "?$select=qm_templatejsontxt"
      )
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
  },

  SaveQuestionnaire: async function (questionnaire, id) {
    let data = null;
    var entity = {};
    entity.qm_templatejsontxt = JSON.stringify(questionnaire);
    alert('saving id: '+id)
    alert('saving json: ' + JSON.stringify(questionnaire))
    alert(JSON.stringify(entity))
    await Xrm.WebApi.online
      .updateRecord(
        "qm_sytemplate",
        id,
        entity
      )
      .then(
        function success(result) {
          data = result.id;
          console.log('success: ' + data)
        },
        function(error) {
          alert('error' + error)
          Xrm.Utility.alertDialog(error.message);
        }
      );
    return data;
  },

  GetGlobalContext: async function () {  

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
