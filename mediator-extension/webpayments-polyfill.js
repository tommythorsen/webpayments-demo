"use strict";

// Send a message to background.js
var sendMessage = function(command, param, callback) {
    if (callback) {
        window.addEventListener("message", function(event) {
            if (!event.data.to || (event.data.to != "webpayments-polyfill.js")) return;
            callback(event.data);
        }, false);
    }
    window.postMessage({to: "background.js", command: command, param: param}, "*");
}

navigator.payments = {
    registerPaymentApp: function(paymentApp) {
        console.log("navigator.payments.registerPaymentApp() called");
        sendMessage("registerPaymentApp", paymentApp);
    },
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
