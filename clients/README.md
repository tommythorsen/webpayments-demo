# Prototype clients for testing Service Worker based Payment App integration.

On this page, I will host prototype builds of the Chromium client, where we are enabling support for Service Worker based Payment Apps. Unless you're a developer, this won't be very useful for you, but if you are interested in developing a Service Worker based Payment App as specified in the [Payment App API specification](https://w3c.github.io/webpayments-payment-apps-api/), you've come to the right place :)

## Latest apk

[Chromium-ServiceWorkerPaymentApps-v0.4.1.apk](https://tommythorsen.github.io/webpayments-demo/clients/Chromium-ServiceWorkerPaymentApps-v0.4.1.apk)

## Requirements

These prototype builds require Android version 6 or higher.

## How to test the prototype client

1. Download and install the client. The easiest way to do this is to navigate to this page with your mobile browser, and download the latest apk file listed above.
1. [Optional] Install a Service Worker based Payment App. This step may not be necessary for all merchants. The test merchant in the step below, for instance, will detect that you have no matching payment app, and send you to the [The TommyPay signup page](https://tommythorsen.github.io/webpayments-demo/payment-apps/tommypay/signup/) automatically.
1. Navigate to a page that supports Payment Request and the same Payment Methods as your installed Payment App provides, and buy something. [This page](https://tommythorsen.github.io/webpayments-demo/merchants/clothing/) works with the TommyPay payment app.

TIP: console.log output and status information about your payment app can be viewed in `chrome://serviceworker-internals`.

## Known issues

* Icons in the manifest are not parsed at all. The specification is currently not clear on how to express icons in the manifests. We are leaning towards doing the same as the AppManifest specification. See https://github.com/w3c/webpayments-payment-apps-api/issues/69

## Older apks

* [Chromium-ServiceWorkerPaymentApps-v0.4.apk](https://tommythorsen.github.io/webpayments-demo/clients/Chromium-ServiceWorkerPaymentApps-v0.4.apk)
* [Chromium-ServiceWorkerPaymentApps-v0.3.apk](https://tommythorsen.github.io/webpayments-demo/clients/Chromium-ServiceWorkerPaymentApps-v0.3.apk)
 * In this version (and previous versions), payment details modifiers were not passed to the service worker.
* [Chromium-ServiceWorkerPaymentApps-v0.2.2.apk](https://tommythorsen.github.io/webpayments-demo/clients/Chromium-ServiceWorkerPaymentApps-v0.2.2.apk)
* [Chromium-ServiceWorkerPaymentApps-v0.2.1.apk](https://tommythorsen.github.io/webpayments-demo/clients/Chromium-ServiceWorkerPaymentApps-v0.2.1.apk)
* [Chromium-ServiceWorkerPaymentApps-v0.2.apk](https://tommythorsen.github.io/webpayments-demo/clients/Chromium-ServiceWorkerPaymentApps-v0.2.apk)
 * This version was buggy and transactions would intermittently not work. v0.2.1 should work better.
* [Chromium-ServiceWorkerPaymentApps-v0.1.1.apk](https://tommythorsen.github.io/webpayments-demo/clients/Chromium-ServiceWorkerPaymentApps-v0.1.1.apk)
 * This version of the client does not implement the complete payment flow. In this build, you can install a payment app, invoke it by selecting it in the Payment Request dialog, but there's currently no way to pass a response back to the browser in order to finalize the payment.
* [Chromium-ServiceWorkerPaymentApps-v0.1.apk](https://tommythorsen.github.io/webpayments-demo/clients/Chromium-ServiceWorkerPaymentApps-v0.1.apk)
 * This version requires that after install, you navigate to `chrome://flags`, scroll down to the "Experimental Web Platform features" flag and enable it. Relaunch by pressing the button in the bottom of the screen.
