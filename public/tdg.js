/* eslint-disable no-undef */
var QMSDK;
(function (QMSDK) {
    var form;
    var formContext;
    var recordGuid;

    // EVENTS
    // eslint-disable-next-line no-unused-vars
    function onLoad(eContext) {
        console.log('Onload has been called');
        console.log('Xrm execution context: ', eContext);

        var formLocal = eContext.getFormContext();
        var formContextLocal = eContext.getFormContext();
        var recordGuidLocal = formContext.data.entity.getId();

        form = formLocal;
        QMSDK.form = formLocal;
        //this.QMSDK.form = formLocal;
        this.QMSDK.formContext = formContextLocal;
        this.QMSDK.recordGuid = recordGuidLocal;

        alert(QMSDK.formContext);

        switch (form.ui.getFormType()) {
            //Create
            case 1:
                alert('mango banana')
                break;
            default:
                break;
        }
    }

    QMSDK.onLoad = onLoad;
    QMSDK.form = form;
    QMSDK.formContext = formContext;
    QMSDK.recordGuid = recordGuid; 

})(QMSDK || (QMSDK = {}));

// let TDG = {
//     formOnLoad: function (executionContext) {
//         window.formExecutionContext = executionContext
//         TDG.formExecutionContext = executionContext
    
//         alert(JSON.stringify(executionContext))
//     }
// }

// function formOnLoad(executionContext) {
//     window.formExecutionContext = executionContext
//     TDG.formExecutionContext = executionContext

//     alert(JSON.stringify(executionContext))
// }
