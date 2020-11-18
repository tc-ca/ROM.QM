export default {
  /* eslint-disable no-undef */

  GetQuestionnaireGroups(questionnaireJSON) {
    // let questionnaire = require('../api/safety-marks-and-documentation.js').default
    let test = require("../api/safety-marks-and-documentation.js").default;

    alert(JSON.stringify(test));

    let questionnaire = questionnaireJSON;
    alert(JSON.stringify(questionnaire));
    // console.log("before processing");
    // console.log(JSON.stringify(questionnaire))
    //TODO: figure out what the below code does, does not seem to change the output on test file.
    let questionDict = {};

    let populateQuestons = queston => {
      questionDict[queston.id] = queston;

      queston.childQuestions.forEach(child => {
        populateQuestons(child);
      });
    };

    questionnaire.groups.forEach(qroup => {
      if (qroup.question) {
        qroup.qustions.forEach(q => populateQuestons(q));
      }
    });

    let populateDependantsOnQuestions = question => {
      question.dependencyGroups.forEach(dg => {
        dg.questionDependencies.forEach(qd => {
          qd.dependsOnQuestion = questionDict[qd.dependsOnQuestion];
        });
      });

      question.childQuestions.forEach(cq =>
        this.populateDependantsOnDependency(cq)
      );
    };

    questionnaire.groups.forEach(qroup => {
      if (qroup.question) {
        qroup.qustions.forEach(q => populateDependantsOnQuestions(q));
      }
    });

    // console.log(JSON.stringify(questionnaire))
    return questionnaire;
  },
  //todo remove hardcoded guid
  //should by named template or questionnaire??
  async GetQuestionnaireById() {
    let data = null;
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
          alert("data coming back", data);
        },
        function(error) {
          Xrm.Utility.alertDialog(error.message);
        }
      );
    return data;
  }
};
