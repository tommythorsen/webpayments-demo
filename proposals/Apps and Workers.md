# Payment Apps and Service Workers

There is currently consensus in the Web Payments Working Group that a Payment App should be a Web App that supports payments. We are still doing registration of Payment Options, and subscription to Payment Request Events, from Service Workers. Regardless of how Browser will choose to represent this in the UI, they will necessarily have to know something about the relationship between Payment Apps and Service Workers. Some discussion of this can be found from this comment onwards: https://github.com/w3c/webpayments-payment-apps-api/issues/98#issuecomment-277808484


## Debunking some common conceptions

#### *"Payment apps can be identified by origin"*

This is not the case. First, please consider the following three simple logical statements:

1. "Payment Apps are Web Apps." (This is by our own definition.)
1. "There may exist multiple Web Apps per origin." (I demonstrated this [here](https://github.com/w3c/webpayments-payment-apps-api/issues/98#issuecomment-277808484).)
1. The above two statements imply that: "There may exist multiple Payment Apps per origin."

Since there can be multiple Payment Apps per origin, it should be fairly obvious that the origin is not a good identifier for a Payment App.


#### *"Payment apps can be identified by scope"*

This is also not the case. First of all, a Web App does not even need to have a scope -- the scope can be [unbounded](https://www.w3.org/TR/appmanifest/#dfn-unbounded). Secondly, two Web Apps may have the same scope. Here are the red and blue Web Apps from before, moved into the same folder, and given manifests that define scope:

* http://people.opera.com/tommyt/purple/blue.html
* http://people.opera.com/tommyt/purple/red.html

These two Web Apps are in the same folder, and have the exact same scope, which shows that we can't rely on the Web App scope for any kind of identification or matching.


#### *"Service workers can be identified by scope"*

This one has been an accepted truth in the Working Group for some time, but after reading the [Service Workers specification](https://w3c.github.io/ServiceWorker/), I have come to believe that this is not true. Nowhere in the specification does it say that the scope of the Service Worker has to be unique. The Service Worker does however have a unique `id` field. Even though current implementations may only allow for one Service Worker per scope, [this issue](https://github.com/w3c/ServiceWorker/issues/921) leads me to think that we should assume this will always be the case.


## Payment App - Service Worker matching proposal

Given all of the limitations above, how can we realistically match our Service Workers to the right Payment Apps? Since we cannot rely on the scopes or paths of either the Payment Apps or the Service Workers, it does not seem possible to deduce these relationships by statically looking at already installed apps and workers. The only chance we have to establish these relationships is at installation time. The proposal below suggests looking at the current [application context](https://w3c.github.io/manifest/#dfn-application-context) while installing a payment-enabled Service Worker, and storing an identifier for the Payment App in the Service Worker for later lookup. I propose that the identifier for the Payment App should be the url of the Web App Manifest file, as this is the only guaranteed unique property of a Web App.

The following algorithms currently uses some of the concepts that are in the specification, but does not actually make a lot of sense for the new way of thinking about Payment Apps as Web Apps. The `PaymentAppManifest` interface is an example of something that should be replaced with something new, or at least renamed. Please try to not get too hung up about these minor details, when reviewing the algorithms below. The general approach should still work, even if we rearrange the Payment Apps spec a bit.


### Algorithm that is run on Service Worker installation

This algorithm should be run by the Browser while installing the Payment Service worker. The implementation of `PaymentAppManager.setManifest()` (or equivalent function, in case this is replaced by something else) would be a good place to do this.

1. Let `paymentAppManifest` be the `PaymentAppManifest` instance that is currently being registered.
1. If the [top-level browsing context](https://w3c.github.io/manifest/#dfn-top-level-browsing-context) does not have a manifest applied to it, throw some error and terminate these steps.
1. Let `manifestUrl` be the URL of the manifest that has been applied to the [top-level browsing context](https://w3c.github.io/manifest/#dfn-top-level-browsing-context).
1. Set the value of a new internal slot `paymentAppManifest.[[manifestUrl]]` to `manifestUrl`.


### Algorithm that is run on PaymentRequest.show()

This algorithm is run by the browser in order to find all the Payment Apps and corresponding Payment Options that can handle a Payment Request.

1. Let `matchingAppsAndOptions` be a new empty map where the keys are Web App Manifest URLs and the values are sequences of PaymentOption instances.
1. For each `serviceWorker` in the set of all installed Service Workers, do:
  1. If no Payment Options have been registered from this Service Worker, move onto the next item.
  1. For each `paymentOption` in the set of Payment Options registered from this Service Worker, do:
    1. If `paymentOption` does not [match](https://w3c.github.io/webpayments-payment-apps-api/#matching) the current Payment Request, move onto the next item.
    1. Let `paymentAppManifest` be the `PaymentAppManifest` associated with `paymentOption`.
    1. Let `manifestUrl` be the value of `paymentAppManifest.[[manifestUrl]]`.
    1. If `manifestUrl` does not exist as a key in `matchingAppsAndOptions`, do:
      1. Create a new empty sequence, and add it to `matchingAppsAndOptions`, for the key `manifestUrl`.
    1. Let `optionSequence` be the sequence that corresponds to the key `manifestUrl` in `matchingAppsAndOptions`.
    1. Append `paymentOption` to `optionSequence`
1. The `matchingAppsAndOptions` map now contains all matching Payment Apps (represented by URLs to Web App Manifest files), and Payment Options. This map can be handed to the UI, which can display some or all of this information.
