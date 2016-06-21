"use strict";

// This is the "backend" for the extension. It is responsible for managing
// communication between the merchant and the payment app, and for handling
// installation of new web apps.

var pendingPaymentRequest = null;
var pendingResponseCallback = null;
var paymentTab = null;

// The implementation of PaymentRequest.show(). It populates the "pending"
// variables above and opens the UI for selecting a matching payment app.
//
// BUG: The popup window is not very nice. It might have looked nicer if we
//      could overlay the payment app selection UI (and the payment app UI
//      itself) over the merchant page.
//
function show(paymentRequest, sendResponse) {
    console.log("show: " + paymentRequest);
    // TODO: Handle the case where there is already a pending request
    pendingPaymentRequest = JSON.parse(paymentRequest);
    pendingResponseCallback = sendResponse;
    var identifiers = "";
    for (var methodData of pendingPaymentRequest.methodData) {
        for (var supportedMethod of methodData.supportedMethods) {
            if (identifiers) identifiers += ",";
            identifiers += supportedMethod;
        }
    }
    var url = "select-payment-app.html";
    if (identifiers) {
        url += "?ids=" + identifiers;
    }
    chrome.tabs.create({url: url, active: false}, function(tab) {
        paymentTab = tab;
        chrome.windows.create(
                {
                    tabId: tab.id,
                    type: 'popup',
                    focused: true,
                    width: 400,
                    height: 800
                });
    });
    return true;
}

// The implementation of navigator.payments.registerPaymentApp(). This function
// uses the chrome storage API to store the payment app entries in a dictionary
// keyed on the start_url property of the payment app.
//
function registerPaymentApp(paymentApp, sendResponse) {
    console.log("registerPaymentApp: " + JSON.stringify(paymentApp));
    var entry = {}
    entry[paymentApp.start_url] = paymentApp;
    chrome.storage.local.set(entry);
    alert("Payment App " + paymentApp.name + " installed");
    sendResponse({to: "webpayments-polyfill.js", result: true});
}

// The implementation of navigator.payments.getRequest(). The payment app
// uses this to fetch the pending payment request.
//
// BUG: We should check that we hand the payment request out to the correct
//      web page. Not so much for the sake of security, since this extension is
//      mainly for testing, but mostly to avoid potentially confusing
//      situations when visiting multiple merchants at the same time.
//
function getRequest(sendResponse) {
    console.log("getRequest");
    sendResponse({to: "webpayments-polyfill.js", request: pendingPaymentRequest});
}

// The implementation of navigator.payments.submitPaymentResponse(). Passes
// the payment response back to the merchant, closes the payment app window,
// and removes the pending payment request.
//
function submitPaymentResponse(paymentResponse, sendResponse) {
    console.log("submitPaymentResponse: " + JSON.stringify(paymentResponse));
    if (paymentTab) {
        chrome.tabs.remove(paymentTab.id);
        paymentTab = null;
    }
    if (pendingResponseCallback) {
        pendingResponseCallback({to: "webpayments-polyfill.js", response: paymentResponse});
        pendingResponseCallback = null;
    }
    pendingPaymentRequest = null;
    sendResponse({to: "webpayments-polyfill.js", result: true});
}

// Message listener for receiving messages from the polyfill functions via
// content.js.
//
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.command == "show") {
        return show(message.param, sendResponse);
    } else if (message.command == "registerPaymentApp") {
        return registerPaymentApp(message.param, sendResponse);
    } else if (message.command == "getRequest") {
        return getRequest(sendResponse);
    } else if (message.command == "submitPaymentResponse") {
        return submitPaymentResponse(message.param, sendResponse);
    } else {
        sendResponse({to: "webpayments-polyfill.js", error: "Unknown command: " + message.command});
    }
});
