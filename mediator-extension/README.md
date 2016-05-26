# The Web Payment Mediator Extension
This Chrome extension adds Web Payments mediator capabilites to your browser. It consists of a content script that injects a `PaymentRequest` and `navigator.payments.*` polyfill into all pages loaded. The functions in this polyfill talks to a background script that processes payment requests and payment app registration requests.

A packaged version of this extension can be found [here](https://tommythorsen.github.io/webpayments-demo/files/mediator-extension.crx).

## Known issues
* The polyfill script containing `PaymentRequest` interface and the `navigator.payments.*` functions is loaded very late. This causes them to not be available by the time a `<script>` tag placed inside `<body` is executed. This makes it tricky to detect from the payment app or from the merchant page whether or not web payments is supported.
* HTTP communication with the payment app, as described [here](https://w3c.github.io/webpayments/proposals/paymentapps/payment-apps.html#sending-the-payment-request-to-the-payment-app), is not supported.
