export default {
  /* eslint-disable no-undef */
  async TestConnection(){
    alert('start TestConnection' )
    var Sdk = window.Sdk || {};
    /**
     * Request to execute WhoAmI function
     */
    Sdk.WhoAmIRequest = function () { };
    
    // NOTE: The getMetadata property should be attached to the function prototype instead of the
    //       function object itself.
    Sdk.WhoAmIRequest.prototype.getMetadata = function () {
        return {
            boundParameter: null,
            parameterTypes: {},
            operationType: 1, // This is a function. Use '0' for actions and '2' for CRUD
            operationName: "WhoAmI",
        };
    };
    
    // Construct a request object from the metadata
    var whoAmIRequest = new Sdk.WhoAmIRequest();
    
    // Use the request object to execute the function
    Xrm.WebApi.online.execute(whoAmIRequest).then(
        function (result) {
            if (result.ok) {
                alert("Status: " + result.status + " statustext" + result.statusText);
                result.json().then(
                    function (response) {
                        alert("User Id: " + response.UserId);
                        // perform other operations as required;
                    });
            }
        },
        function (error) {
            alert(error.message);
            // handle error conditions
        }
    ),
    function (error){
      alert(error);
    }
  }
  ,
  async GetQuestionnaireGroups () {
    
    // let questionnaire = require('../api/safety-marks-and-documentation.js').default
    let questionnaire = await Loadtemplate()
    alert(questionnaire)

    let questionDict = {}

    let populateQuestons = (queston) => {
      questionDict[queston.id] = queston

      queston.childQuestions.forEach(child => {
        populateQuestons(child)
      })
    }

    questionnaire.groups.forEach(qroup => {
      if (qroup.question) {
        qroup.qustions.forEach(q => populateQuestons(q))
      }
    })

    let populateDependantsOnQuestions = (question) => {
      question.dependencyGroups.forEach(dg => {
        dg.questionDependencies.forEach(qd => {
          qd.dependsOnQuestion = questionDict[qd.dependsOnQuestion]
        })
      })

      question.childQuestions.forEach(cq => this.populateDependantsOnDependency(cq))
    }

    questionnaire.groups.forEach(qroup => {
      if (qroup.question) {
        qroup.qustions.forEach(q => populateDependantsOnQuestions(q))
      }
    })

    return questionnaire
  },

  async GetTemplateJson(){
    alert('start GetTemplateJson')
    
    var Sdk = window.Sdk || {};
    /**
     * Request to execute WhoAmI function
     */
    Sdk.ovs_TemplateGetRequest = function () { };
    
    // NOTE: The getMetadata property should be attached to the function prototype instead of the
    //       function object itself.
    Sdk.ovs_TemplateGetRequest.prototype.getMetadata = function () {
        return {
          boundParameter: null,
          parameterTypes: {},
          operationType: 0,
          operationName: "ovs_TemplateGet"
      };
    };

    // Construct a request object from the metadata
    var templateGetRequest = new Sdk.ovs_TemplateGetRequest();

    Xrm.WebApi.online.execute(templateGetRequest).then(
      function (result) {
          if (result.ok) {
              alert("Status: " + result.status + " statustext" + result.statusText);
              result.json().then(
              function (response) {
                  alert("banana User Id: " + response);
                  alert("banana User Id: " + response.QuestionnaireJson);
                  // perform other operations as required;
              });
          }
      },
      function (error) {
          alert(error.message);
          // handle error conditions
      }
    ),
    function (error){
      alert(error.message);
    }
  },

  async Loadtemplate() {//schema, callback, commit) {
    //await this.TestConnection()
    //await this.GetTemplateJson()
   await Xrm.WebApi.online
      .retrieveRecord(
        "qm_sytemplate",
        "893bcfb7-49f1-4c2f-8cf5-a412893fb229",
        "?$select=qm_templatejsontxt"
      )
      .then(
        function success(result) {
          var qm_templatejsontxt = result["qm_templatejsontxt"];
          alert('inside load template');
          alert(qm_templatejsontxt);
          return qm_templatejsontxt
        },
        function(error) {
          Xrm.Utility.alertDialog(error.message);
        }
      );
  }
}
