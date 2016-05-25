"use strict";
// This content script injects the webpayments-polyfill code into every
// web page loaded. This allows the web pages to use the
// navigator.payments.* functions

// Create a <script> element
var script = document.createElement('script');
// Point it at the polyfill
script.src = chrome.extension.getURL('webpayments-polyfill.js');
// Add the <script> element to the DOM
(document.head || document.documentElement).appendChild(script);

// Pass messages between the polyfill and the extension
window.addEventListener("message", function(event) {
    if (!event.data.to || (event.data.to != "background.js")) return
    chrome.runtime.sendMessage(event.data, function(response) {
        event.source.postMessage(response, "*");
    });
}, false);

