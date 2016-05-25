"use strict";

var pendingPaymentRequest = null;
var pendingResponseCallback = null;
var paymentTab = null;

function show(paymentRequest, sendResponse) {
    console.log("show: " + JSON.stringify(paymentRequest));
    // TODO: Handle the case where there is already a pending request
    pendingPaymentRequest = JSON.parse(paymentRequest);
    pendingResponseCallback = sendResponse;
    chrome.tabs.create({url: "select-payment-app.html", active: false}, function(tab) {
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

function registerPaymentApp(paymentApp, sendResponse) {
    console.log("registerPaymentApp: " + JSON.stringify(paymentApp));
    var entry = {}
    entry[paymentApp.start_url] = paymentApp;
    chrome.storage.local.set(entry);
    alert("Payment App " + paymentApp.name + " installed");
    sendResponse({to: "webpayments-polyfill.js", result: true});
}

function getRequest(sendResponse) {
    console.log("getRequest");
    sendResponse({to: "webpayments-polyfill.js", request: pendingPaymentRequest});
}

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
