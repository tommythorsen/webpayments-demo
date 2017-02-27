# Payment Apps and Service Workers -- 2nd attempt

After discussing with the Working Group (and with Adam Roach in particular, in issue [#104](https://github.com/w3c/webpayments-payment-apps-api/pull/104)), it seems clear that we do not want to require a Payment App Manifest for a Payment App. We will pick the names and icons we need out of the top-level browsing context -- from an applied manifest if there is one -- or from the Document's metadata if no manifest has been applied.

The advantage of this approach, is that the Payment App API will have less dependencies, and arguably be easier to use.

The disadvantage is that we lose the ability to identify the Payment App, which will prevent us from merging Payment Options and Wallets from multiple Service Workers within one app. There are ways to remedy this, though, for instance by adding a Payment App Identifier (a GUID maybe?). This identifier could be added to the `PaymentAppDetails` dictionary defined below.


## Proposal

This proposal may not be completely water proof at this point, but it's meant more as a starting point for further discussion, than as a ready-to-cut-and-paste-into-the-spec kind of proposal.


### Algorithm that is run on Service Worker installation

This algorithm should be run by the Browser while installing the Payment Service worker. The exact trigger for this algorithm can be decided upon later. One requirement for this algorithm is the addition of an internal slot [appDetails] in the `PaymentAppManager` interface. This internal slot refers to a `PaymentAppDetails` dictionary instance, as defined below:

```javascript
dictionary PaymentAppDetails {
    required DOMString name;
    sequence<ImageObject> icons;
};
```

1. Let `paymentAppManager` be the `PaymentAppManager` instance that corresponds to the Service Worker being installed.
1. Let `appDetails` be a new instance of `PaymentAppDetails`.
1. Set the values of `appDetails.name` and `appDetails.icons` to the outcome of running the [**steps to install the web application**](https://w3c.github.io/manifest/#dfn-steps-to-install-the-web-application) from the [Web App Manifest specification](https://w3c.github.io/manifest/), with the modification that in step 2.3, the user agent MUST support falling back to Document metadata. We may also want to replace the "installation process" from the Web App Manifest specification with our own, in those steps.
1. Set the value of the internal slot `paymentAppManager.[[appDetails]]` to `appDetails`.


### Algorithm that is run on PaymentRequest.show()

This algorithm describes how to use the registered payment information for each service worker to construct a user experience for PaymentRequest.show(). We use the concepts of "1st level item" and "2nd level item" to describe the hierarchical presentation of Apps, Wallets and Options, be it on screen or in any other medium.

1. For each `serviceWorker` in the set of all installed Service Workers, do:
  1. Let `paymentAppManager` be the `PaymentAppManager` instance that corresponds to the Service Worker being installed.
  1. If `paymentAppManager.options` does not contain any options, move onto the next Service Worker.
  1. Let `options` be a shallow clone of `paymentAppManager.options`.
  1. For each `option` in `options`, do:
    1. If `option` does not [match](https://w3c.github.io/webpayments-payment-apps-api/#matching) the current Payment Request, remove it from `options`
  1. For each `wallet` in `paymentAppManager.wallets`, do:
    1. Create a 1st level item using `wallet.name` and `wallet.icons` as input.
    1. For each `optionKey` in `wallet.optionKeys`, do:
      1. Let `option` be the result of calling `options.get(optionKey)`.
      1. Call `options.delete(optionKey)` to remove the option from `options`
      1. If `option` is `null`, move onto the next `optionKey`.
      1. Create a 2nd level item using `option.name` and `option.icons?` as input, and connect it to the 1st level item that we created for `wallet`.
  1. If there are any remaining items in `options`, then:
    1. Let `appDetails` be the value of `paymentAppManager.[[appDetails]]`.
    1. Create a 1st level item using `appDetails.name` and `appDetails.icons` as input.
    1. For each remaining `option` in `options`, do:
      1. Create a 2nd level item using `option.name` and `option.icons` as input, and connect it to the 1st level item that we created for `appDetails`.


## Examples
