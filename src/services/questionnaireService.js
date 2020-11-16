// function IsFieldDisplayed (optionSetValue) {
//   return !!((optionSetValue === FIELD_REQUIREMENT.OPTIONAL || optionSetValue === FIELD_REQUIREMENT.REQUIRED))
// }

// import { includes } from 'core-js/fn/array'

// function IsFieldRequired (optionSetValue) {
//   return (optionSetValue === FIELD_REQUIREMENT.REQUIRED)
// }

// function IsProblem (optionSetValue) {
//   return (optionSetValue === PROBLEM_TYPE.PROBLEM_YES)
// }

export default {

  // ,
  // Auth () {
  //   var express = require('express');
  //   var logger = require('connect-logger');
  //   var cookieParser = require('cookie-parser');
  //   var session = require('cookie-session');
  //   var fs = require('fs');
  //   var crypto = require('crypto');

  //   var AuthenticationContext = require('adal-node').AuthenticationContext;

  //   var app = express();
  //   app.use(logger());
  //   app.use(cookieParser('a deep secret'));
  //   app.use(session({secret: '1234567890QWERTY'}));

  //   app.get('/', function(req, res) {
  //     res.redirect('login');
  //   });

  //   /*
  //   * You can override the default account information by providing a JSON file
  //   * with the same parameters as the sampleParameters variable below.  Either
  //   * through a command line argument, 'node sample.js parameters.json', or
  //   * specifying in an environment variable.
  //   * {
  //   *   "tenant" : "rrandallaad1.onmicrosoft.com",
  //   *   "authorityHostUrl" : "https://login.windows.net",
  //   *   "clientId" : "624ac9bd-4c1c-4686-aec8-e56a8991cfb3",
  //   *   "clientSecret" : "verySecret="
  //   * }
  //   */
  //   var parametersFile = process.argv[2] || process.env['ADAL_SAMPLE_PARAMETERS_FILE'];

  //   var sampleParameters;
  //   if (parametersFile) {
  //     var jsonFile = fs.readFileSync(parametersFile);
  //     if (jsonFile) {
  //       sampleParameters = JSON.parse(jsonFile);
  //     } else {
  //       console.log('File not found, falling back to defaults: ' + parametersFile);
  //     }
  //   }

  //   if (!parametersFile) {
  //     sampleParameters = {
  //       tenant : 'rrandallaad1.onmicrosoft.com',
  //       authorityHostUrl : 'https://login.windows.net',
  //       clientId : '624ac9bd-4c1c-4686-aec8-b56a8991cfb3',
  //       username : 'frizzo@naturalcauses.com',
  //       password : ''
  //     };
  //   }

  //   var authorityUrl = sampleParameters.authorityHostUrl + '/' + sampleParameters.tenant;
  //   var redirectUri = 'http://localhost:3000/getAToken';
  //   var resource = '00000002-0000-0000-c000-000000000000';

  //   var templateAuthzUrl = 'https://login.windows.net/' + sampleParameters.tenant + '/oauth2/authorize?response_type=code&client_id=<client_id>&redirect_uri=<redirect_uri>&state=<state>&resource=<resource>';


  //   app.get('/', function(req, res) {
  //     res.redirect('/login');
  //   });

  //   app.get('/login', function(req, res) {
  //     console.log(req.cookies);

  //     res.cookie('acookie', 'this is a cookie');

  //     res.send('\
  //   <head>\
  //     <title>test</title>\
  //   </head>\
  //   <body>\
  //     <a href="./auth">Login</a>\
  //   </body>\
  //       ');
  //   });

  //   function createAuthorizationUrl(state) {
  //     var authorizationUrl = templateAuthzUrl.replace('<client_id>', sampleParameters.clientId);
  //     authorizationUrl = authorizationUrl.replace('<redirect_uri>',redirectUri);
  //     authorizationUrl = authorizationUrl.replace('<state>', state);
  //     authorizationUrl = authorizationUrl.replace('<resource>', resource);
  //     return authorizationUrl;
  //   }

  //   // Clients get redirected here in order to create an OAuth authorize url and redirect them to AAD.
  //   // There they will authenticate and give their consent to allow this app access to
  //   // some resource they own.
  //   app.get('/auth', function(req, res) {
  //     crypto.randomBytes(48, function(ex, buf) {
  //       var token = buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');

  //       res.cookie('authstate', token);
  //       var authorizationUrl = createAuthorizationUrl(token);

  //       res.redirect(authorizationUrl);
  //     });
  //   });

  //   // After consent is granted AAD redirects here.  The ADAL library is invoked via the
  //   // AuthenticationContext and retrieves an access token that can be used to access the
  //   // user owned resource.
  //   app.get('/getAToken', function(req, res) {
  //     if (req.cookies.authstate !== req.query.state) {
  //       res.send('error: state does not match');
  //     }
  //     var authenticationContext = new AuthenticationContext(authorityUrl);
  //     authenticationContext.acquireTokenWithAuthorizationCode(req.query.code, redirectUri, resource, sampleParameters.clientId, sampleParameters.clientSecret, function(err, response) {
  //       var message = '';
  //       if (err) {
  //         message = 'error: ' + err.message + '\n';
  //       }
  //       message += 'response: ' + JSON.stringify(response);

  //       if (err) {
  //         res.send(message);
  //         return;
  //       }

  //       // Later, if the access token is expired it can be refreshed.
  //       authenticationContext.acquireTokenWithRefreshToken(response.refreshToken, sampleParameters.clientId, sampleParameters.clientSecret, resource, function(refreshErr, refreshResponse) {
  //         if (refreshErr) {
  //           message += 'refreshError: ' + refreshErr.message + '\n';
  //         }
  //         message += 'refreshResponse: ' + JSON.stringify(refreshResponse);

  //         res.send(message); 
  //       }); 
  //     });
  //   });

  //   this.TestConnection()
  // },

  /* eslint-disable no-undef */
  TestConnection(){
    Xrm.Page.ui.setFormNotification("Testing Connection","INFORMATION","1");

    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/WhoAmI()", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                JSON.parse(this.response);
                Xrm.Utility.alertDialog(this.response);

            } else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send();
  },

  GetQuestionnaireGroups () {
    let questionnaire = require('../api/safety-marks-and-documentation.js').default

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

  GetQuestionnaireGroupsFromCRM() {//schema, callback, commit) {
    this.TestConnection()

    var req = new XMLHttpRequest();
    req.open("POST", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/ovs_TemplateGet", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var result = JSON.parse(this.response);
                alert(JSON.stringify(result.QuestionnaireJson, null, 2))
            } else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send();
  }
}
