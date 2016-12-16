# Prototype clients for testing Service Worker based Payment App integration.

On this page, I will host prototype builds of the Chromium client, where we are enabling support for Service Worker based Payment Apps. Unless you're a developer, this won't be very useful for you, but if you are interested in developing a Service Worker based Payment App as specified in the [Payment App API specification](https://w3c.github.io/webpayments-payment-apps-api/), you've come to the right place :)

## Latest apk

[Chromium-ServiceWorkerPaymentApps-v0.1.apk](https://tommythorsen.github.io/webpayments-demo/clients/Chromium-ServiceWorkerPaymentApps-v0.1.apk)

## How to test the prototype client

1. Download and install the client. The easiest way to do this is to navigate to this page with your mobile browser, and press [this link](https://tommythorsen.github.io/webpayments-demo/clients/Chromium-ServiceWorkerPaymentApps-v0.1.apk).
1. In the newly installed prototype client, navigate to chrome://flags, scroll down to the "Experimental Web Platform features" flag and enable it. Relaunch by pressing the button in the bottom of the screen.
1. Install a Service Worker based Payment App. You can install the TommyPay test payment app by opening the newly installed prototype client, navigating to [The TommyPay home page](https://tommythorsen.github.io/webpayments-demo/payment-apps/tommypay/), and pressing the "Install Payment App" button. It should say "TommyPay successfully registered".
1. Buy something by navigating to a page that supports Payment Request and the same Payment Methods as your installed Payment App provides, and buying something. [This page](https://tommythorsen.github.io/webpayments-demo/merchants/clothing/) works with the TommyPay payment app.

TIP: console.log output and status information about your payment app can be viewed in [chrome://serviceworker-internals](chrome://serviceworker-internals).

## Known issues

* The client does not implement the complete payment flow. In the current build, you can install a payment app, invoke it by selecting it in the Payment Request dialog, but there's currently no way to pass a response back to the browser in order to finalize the payment. This is being worked on.
* Payment details modifiers are not passed to the service worker. The payment request event that the service worker receives, contains the following fields: "origin", "methodData", "total" and "optionId". There is useful and relevant data in the PaymentDetailsModifier dictionaries, too, but this isn't passed to the Payment App yet. This will be sorted out in a later release.
