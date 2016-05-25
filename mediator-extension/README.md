# The Web Payment Mediator Extension
This Chrome extension adds Web Payments mediator capabilites to your browser. It consists of a content script that injects a `PaymentRequest` and `navigator.payments.*` polyfill into all pages loaded. The functions in this polyfill talks to a background script that processes payment requests and payment app registration requests.

A packaged version of this extension can be found [here](https://tommythorsen.github.io/webpayments-demo/files/mediator-extension.crx).
