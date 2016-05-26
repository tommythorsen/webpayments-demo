"use strict";

// This file implements the Web Payments javascript API, which consists of
// the PaymentRequest constructor plus a set of functions under
// navigator.payments. This script is injected into all loaded documents
// by content.js.

navigator.payments = {
    // This function installs a payment app in the payment mediator. It is
    // defined here:
    //
    //  https://w3c.github.io/webpayments/proposals/paymentapps/payment-apps.html#registerpaymentapp
    //
    registerPaymentApp: function(paymentApp) {
        console.log("navigator.payments.registerPaymentApp() called");
        sendMessage("registerPaymentApp", paymentApp);
    },
    // This function can be used by the payment app to get the payment request
    // object that was used to invoke the payment app. It is not part of any
    // proposal yet, but has been discussed by the working group. See these
    // pages:
    //
    //  https://github.com/w3c/browser-payment-api/issues/16
    //  https://github.com/w3c/webpayments/issues/130
    //
    getRequest: function() {
        console.log("navigator.payments.getRequest() called");
        return new Promise(function(resolve, reject) {
            sendMessage("getRequest", false, function(response) {
                if (response.error) {
                    reject(response.error);
                } else {
                    resolve(response.request);
                }
            });
        });
    },
    // After a payment app has processed the payment request, it should return
    // a payment response, using this function. "submitPaymentResponse" is
    // defined here:
    //
    //  https://w3c.github.io/webpayments/proposals/paymentapps/payment-apps.html#accepting-the-paymentresponse
    //
    submitPaymentResponse: function(paymentResponse) {
        console.log("navigator.payments.submitPaymentResponse() called");
        return new Promise(function(resolve, reject) {
            sendMessage("submitPaymentResponse", paymentResponse, function(response) {
                if (response.error) {
                    reject(response.error);
                } else {
                    resolve(response.result);
                }
            });
        });
    }
}

// The PaymentRequest interface as defined at:
//
//  https://www.w3.org/TR/payment-request/#paymentrequest-interface
//
// The "supportedMethods" and "details" parameters are mandatory. "options"
// and "data" are optional.
//
function PaymentRequest(supportedMethods, details, options, data) {
    this.supportedMethods = supportedMethods;
    this.details = details;
    this.options = options;
    this.data = data;
    this.show = function() {
        console.log("PaymentRequest.show() called");
        var request = JSON.stringify(this);
        return new Promise(function(resolve, reject) {
            sendMessage("show", request, function(response) {
                if (response.error) {
                    reject(response.error);
                } else {
                    resolve(response.response);
                }
            });
        });
    }
}

// Internal helper function for passing messages to background.js
var sendMessage = function(command, param, callback) {
    if (callback) {
        window.addEventListener("message", function(event) {
            if (!event.data.to || (event.data.to != "webpayments-polyfill.js")) return;
            callback(event.data);
        }, false);
    }
    window.postMessage({to: "background.js", command: command, param: param}, "*");
}

