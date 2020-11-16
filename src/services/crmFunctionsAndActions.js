"use strict";  
var Sdk = window.Sdk || {};  
  
/* eslint-disable no-undef */
/**  
 * @function getClientUrl   
 * @description Get the client URL.  
 * @return {string} The client URL.  
 */  
 Sdk.getClientUrl = function () {  
 var context;  
 // GetGlobalContext defined by including reference to   
 // ClientGlobalContext.js.aspx in the HTML page.  
 if (typeof GetGlobalContext != "undefined") {  
  context = GetGlobalContext();  
 } else {  
  if (typeof Xrm != "undefined") {  
   // Xrm.Page.context defined within the Xrm.Page object model for form scripts.  
   context = Xrm.Page.context;  
  } else {  
   throw new Error("Context is not available.");  
  }  
 }  
 return context.getClientUrl();  
};  
  
var clientUrl = Sdk.getClientUrl();     // ie.: https://org.crm.dynamics.com  
var webAPIPath = "/api/data/v9.1";      // Path to the web API.  
var opportunityUri;                     // Closed opportunity to re-open before deleting.  
var letterUri;                          // Letter to add to contact's queue.  
var contactUri;                         // Add a note to this contact.  
// var templateId = "General Compliance"; // For custom action.  
  
/**  
 * @function getWebAPIPath   
 * @description Get the full path to the Web API.  
 * @return {string} The full URL of the Web API.  
 */  
Sdk.getWebAPIPath = function () {  
 return Sdk.getClientUrl() + webAPIPath;  
}  
  
/**  
 * @function request  
 * @description Generic helper function to handle basic XMLHttpRequest calls.  
 * @param {string} action - The request action. String is case-sensitive.  
 * @param {string} uri - An absolute or relative URI. Relative URI starts with a "/".  
 * @param {object} data - An object representing an entity. Required for create and update actions.  
 * @param {object} addHeader - An object with header and value properties to add to the request  
 * @returns {Promise} - A Promise that returns either the request object or an error object.  
 */  
Sdk.request = function (action, uri, data, addHeader) {  
 if (!RegExp(action, "g").test("POST PATCH PUT GET DELETE")) { // Expected action verbs.  
  throw new Error("Sdk.request: action parameter must be one of the following: " +  
      "POST, PATCH, PUT, GET, or DELETE.");  
 }  
 // eslint-disable-next-line no-constant-condition
 if (!typeof uri === "string") {  
  throw new Error("Sdk.request: uri parameter must be a string.");  
 }  
 if ((RegExp(action, "g").test("POST PATCH PUT")) && (!data)) {  
  throw new Error("Sdk.request: data parameter must not be null for operations that create or modify data.");  
 }  
 if (addHeader) {  
  if (typeof addHeader.header != "string" || typeof addHeader.value != "string") {  
   throw new Error("Sdk.request: addHeader parameter must have header and value properties that are strings.");  
  }  
 }  
  
 // Construct a fully qualified URI if a relative URI is passed in.  
 if (uri.charAt(0) === "/") {  
  uri = clientUrl + webAPIPath + uri;  
 }  
  
 return new Promise(function (resolve, reject) {  
  var request = new XMLHttpRequest();  
  request.open(action, encodeURI(uri), true);  
  request.setRequestHeader("OData-MaxVersion", "4.0");  
  request.setRequestHeader("OData-Version", "4.0");  
  request.setRequestHeader("Accept", "application/json");  
  request.setRequestHeader("Content-Type", "application/json; charset=utf-8");  
  if (addHeader) {  
   request.setRequestHeader(addHeader.header, addHeader.value);  
  }  
  request.onreadystatechange = function () {  
   if (this.readyState === 4) {  
    request.onreadystatechange = null;  
    switch (this.status) {  
     case 200: // Success with content returned in response body.  
     case 204: // Success with no content returned in response body.  
     case 304: // Success with Not Modified  
      resolve(this);  
      break;  
     default: // All other statuses are error cases.  
      var error;  
      try {  
       error = JSON.parse(request.response).error;  
      } catch (e) {  
       error = new Error("Unexpected Error");  
      }  
      reject(error);  
      break;  
    }  
   }  
  };  
  request.send(JSON.stringify(data));  
 });  
};  
  
/**  
 * @function Sdk.startSample  
 * @description Initiates a chain of promises to show use of Functions and Actions with the Web API.  
 * Functions and actions represent re-usable operations you can perform using the Web API.  
 * For more info, see https://msdn.microsoft.com/library/mt607990.aspx#bkmk_actions  
 * The following standard CRM Web API functions and actions are invoked:  
 *  - WhoAmI, a basic unbound function  
 *  - GetTimeZoneCodeByLocalizedName, an unbound function that requires parameters  
 *  - CalculateTotalTimeIncident, a bound function  
 *  - WinOpportunity, an unbound action that takes parameters  
 *  - AddToQueue, a bound action that takes parameters  
 *  - In addition, a custom bound and an unbound action contained within the solution are invoked.   
 */  
Sdk.startSample = function () {  
 // Create the CRM entry intances used by this sample program.  
 Sdk.getUsersFullName() 
 .then(function (fullName) {  
  alert("\tYour full name is: %s\n", fullName);  
  
  var localizedStandardName = 'Pacific Standard Time';  
  var localeId = 1033;  
  // Demonstrates best practice of passing parameters.  
  var uri = ["/GetTimeZoneCodeByLocalizedName",  
   "(LocalizedStandardName=@p1,LocaleId=@p2)",  
   "?@p1='" + localizedStandardName + "'&@p2=" + localeId];  
  
  /* This would also work:  
    var uri = ["/GetTimeZoneCodeByLocalizedName",  
    "(LocalizedStandardName='" + localizedStandardName + "',LocaleId=" + localeId + ")"];  
  */  
  
  return Sdk.request("GET", uri.join("")) // Send request.  
 })  
 .then(function (request) {  
  // Returns GetTimeZoneCodeByLocalizedNameResponse ComplexType.   
  // For more info, see https://msdn.microsoft.com/library/mt607889.aspx  
  var localizedStandardName = 'Pacific Standard Time';  
  var timeZoneCode = JSON.parse(request.response).TimeZoneCode;  
  Xrm.Utility.alertDialog("\tFunction returned time zone %s, with code '%s'.", localizedStandardName, timeZoneCode);  
 })  
 .then(function (request) {  
  var whoAmIResponse = JSON.parse(request.response);  
  var myId = whoAmIResponse.UserId;  
  
  // Get a reference to the current user.  
  return Sdk.request("GET", Sdk.getWebAPIPath() + "/systemusers(" + myId + ")/queueid/$ref")  
 })  
 .catch(function (err) {  
  Xrm.Utility.alertDialog("ERROR: " + err.message);  
 });  
}  
  
/**  
 * @function Sdk.deleteEntities  
 * @description Deletes the entities created by this sample  
 */  
Sdk.deleteEntities = function () {  
 return new Promise(function (resolve, reject) {  
  
  entitiesToDelete.unshift(opportunityUri) // Adding to the beginning so it will get deleted before the parent account.  
  // Re-open the created opportunity so it can be deleted.  
  Sdk.request("PATCH", opportunityUri, { statecode: 0, statuscode: 2 })  
  .then(function () {  
   // Get the opportunityclose URI so it can be deleted  
   return Sdk.request("GET", opportunityUri + "/Opportunity_OpportunityClose/$ref")  
  })  
  .then(function (request) {  
   var opportunityCloseUri = JSON.parse(request.response).value[0]["@odata.id"];  
  
   // Adding to the opportunityclose URI it will get deleted before the opportunity.  
   entitiesToDelete.unshift(opportunityCloseUri)  
  
   /*  
  These deletions have to be done consecutively in a specific order to avoid a Generic SQL error  
  which can occur because of relationship behavior actions for the delete event.  
  */  
  
   return Sdk.request("DELETE", entitiesToDelete[0]) //opportunityclose  
  })  
  .then(function () {  
   Xrm.Utility.alertDialog(entitiesToDelete[0] + " Deleted");  
   return Sdk.request("DELETE", entitiesToDelete[1]) //opportunity  
  })  
  .then(function () {  
   Xrm.Utility.alertDialog(entitiesToDelete[1] + " Deleted");  
   return Sdk.request("DELETE", entitiesToDelete[2])//account  
  })  
  .then(function () {  
   Xrm.Utility.alertDialog(entitiesToDelete[2] + " Deleted");  
   return Sdk.request("DELETE", entitiesToDelete[3]) //Fourth Coffee account  
  })  
  .then(function () {  
   Xrm.Utility.alertDialog(entitiesToDelete[3] + " Deleted");  
   return Sdk.request("DELETE", entitiesToDelete[4]) //Letter  
  })  
  .then(function () {  
   Xrm.Utility.alertDialog(entitiesToDelete[4] + " Deleted");  
   return Sdk.request("DELETE", entitiesToDelete[5]) //Contact  
  })  
  .then(function () {  
   Xrm.Utility.alertDialog(entitiesToDelete[5] + " Deleted");  
   return Sdk.request("DELETE", entitiesToDelete[6]) //AccountCustomer  
  })  
  .then(function () {  
   Xrm.Utility.alertDialog(entitiesToDelete[6] + " Deleted");  
   resolve();  
  })  
  .catch(function (err) {  
   reject(new Error("Error from Sdk.deleteEntities: " + err.message));  
  });  
 });  
};  
  
/**  
 * @function Sdk.getUsersFullName  
 * @description Retrieves the current user's full name.  
 * @returns {Promise} - A Promise that returns the full name of the user  
 */  
Sdk.getUsersFullName = function () {  
 return new Promise(function (resolve, reject) {  
  //Use WhoAmI Function (https://msdn.microsoft.com/library/mt607925.aspx)  
  Sdk.request("GET", "/WhoAmI")  
  .then(function (request) {  
   //Returns WhoAmIResponse ComplexType (https://msdn.microsoft.com/library/mt607982.aspx)  
   var myId = JSON.parse(request.response).UserId;  
   //Retrieve the systemuser Entity fullname property (https://msdn.microsoft.com/library/mt608065.aspx)  
   return Sdk.request("GET", "/systemusers(" + myId + ")?$select=fullname")  
  })  
  .then(function (request) {  
   //Return the users full name  
   resolve(JSON.parse(request.response).fullname);  
  })  
  .catch(function (err) {  
   reject("Error in Sdk.getUsersFullName function: " + err.message);  
  });  
 });  
};  
  
/**  
 * @function Sdk.createRequiredRecords  
 * @description Creates data required by this sample program.  
 *  - Create an account with three 30 minute tasks.  
 *  - Create another account associated with an opportunity.  
 *  - Create a letter.  
 *  - Create a contact.  
 * @returns {Promise} - resolve the promise if all goes well; reject otherwise.  
 */  
Sdk.createRequiredRecords = function () {  
 Xrm.Utility.alertDialog("-- Creating sample data --");  
 // Create a parent account, an associated incident with three   
 // associated tasks(required for CalculateTotalTimeIncident).  
 return new Promise(function (resolve, reject) {  
  Sdk.createAccountWithIncidentAndThree30MinuteClosedTasks()  
  .then(function (iUri) {  
   incidentUri = iUri;  
  
   //Create another account and associated opportunity (required for CloseOpportunityAsWon).  
   return Sdk.createAccountWithOpportunityToWin();  
  })  
  .then(function (oUri) {  
   opportunityUri = oUri;  
  
   // Create a letter to use with AddToQueue action.  
   var letter = {  
    description: "Example letter"  
   }  
   return Sdk.request("POST", "/letters", letter)  
  })  
  .then(function (request) {  
   letterUri = request.getResponseHeader("OData-EntityId");  
   entitiesToDelete.push(letterUri);  
  
   // Create a contact to use with custom action sample_AddNoteToContact   
   var contact = {  
    firstname: "Jon",  
    lastname: "Fogg"  
   }  
   return Sdk.request("POST", "/contacts", contact)  
  })  
  .then(function (request) {  
   contactUri = request.getResponseHeader("OData-EntityId");  
   entitiesToDelete.push(contactUri);  
  
   resolve()  
  })  
  .catch(function (err) {  
   reject("Error in Sdk.createRequiredRecords function: " + err.message);  
  });  
 });  
}  
  
/**  
 * @function Sdk.createAccountwithIncidentAndThree30MinuteClosedTasks  
 * @description Create an account and associate three 30 minute tasks. Close the tasks.  
 * @returns {Promise} - A Promise that returns the uri of an incident created.  
 */  
Sdk.createAccountWithIncidentAndThree30MinuteClosedTasks = function () {  
 return new Promise(function (resolve, reject) {  
  var iUri; // incidentUri  
  // Create a parent account for the incident.  
  Sdk.request("POST", "/accounts", { name: "Fourth Coffee" })  
  .then(function (request) {  
   // Capture the URI of the created account so it can be deleted later.  
   var accountUri = request.getResponseHeader("OData-EntityId");  
   entitiesToDelete.push(accountUri);  
   // Define an incident associated with the account with three related tasks.  
   // Each task has a 30 minute duration.  
   var incident = {  
    title: "Sample Case",  
    "customerid_account@odata.bind": accountUri,  
    Incident_Tasks: [  
     {  
      subject: "Task 1",  
      actualdurationminutes: 30  
     },  
     {  
      subject: "Task 2",  
      actualdurationminutes: 30  
     },  
     {  
      subject: "Task 3",  
      actualdurationminutes: 30  
     }  
    ]  
   };  
   // Create the incident and related tasks.  
   return Sdk.request("POST", "/incidents", incident)  
  })  
  .then(function (request) {  
   iUri = request.getResponseHeader("OData-EntityId");  
  
   // Retrieve references to the tasks created.  
   return Sdk.request("GET", iUri + "/Incident_Tasks/$ref")  
  })  
  .then(function (request) {  
   // Capture the URL for the three tasks in this array.  
   var taskReferences = [];  
   JSON.parse(request.response).value.forEach(function (tr) {  
    taskReferences.push(tr["@odata.id"]);  
   });  
   // An array to hold a set of promises.  
   var promises = [];  
   // The data to use to update the tasks so that they are closed.  
   var update = {  
    statecode: 1, //Completed  
    statuscode: 5 //Completed  
   }  
   // Fill the array with promises  
   taskReferences.forEach(function (tr) {  
    promises.push(Sdk.request("PATCH", tr, update))  
   })  
   // When all the promises resolve, return a promise.  
   return Promise.all(promises);  
  })  
  .then(function () {  
   // Return the incident URI to the calling code.  
   resolve(iUri);  
  })  
  .catch(function (err) {  
   // Differentiate the message for any error returned by this function.  
   reject(new Error("ERROR in Sdk.createAccountwithIncidentAndThree30MinuteClosedTasks function: " + err.message))  
  });  
 });  
}  
  
/**  
 * @function Sdk.createAccountwithOpportunityToWin  
 * @description Create an account and an associated opportunity.  
 * @returns {Promise} - A Promise that returns the uri of an opportunity.  
 */  
Sdk.createAccountWithOpportunityToWin = function () {  
 return new Promise(function (resolve, reject) {  
  var accountUri;  
  var account = {  
   name: "Sample Account for WebAPIFunctionsAndActions sample",  
   opportunity_customer_accounts: [{  
    name: "Opportunity to win"  
   }]  
  };  
  Sdk.request("POST", "/accounts", account) // Create the account.  
  .then(function (request) {  
   accountUri = request.getResponseHeader("OData-EntityId");  
   entitiesToDelete.push(accountUri);  
  
   // Retrieve the opportunity's reference.  
   return Sdk.request("GET", accountUri + "/opportunity_customer_accounts/$ref")  
  })  
  .then(function (request) {  
   var oUri = JSON.parse(request.response).value[0]["@odata.id"];  
   resolve(oUri); // Return the opportunity's uri.  
  })  
  .catch(function (err) {  
   reject(new Error("Error in Sdk.createAccountwithOpportunityToWin: " + err.message));  
  });  
 });  
};