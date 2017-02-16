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

### Pseudo code that is run on Service Worker installation

This code should be run by the Browser while installing the Payment Service worker. The implementation of `PaymentAppManager.setManifest()` (or equivalent function, in case this is replaced by something else) would be a good place to do this.

1. If the [top-level browsing context](https://w3c.github.io/manifest/#dfn-top-level-browsing-context) does not have a manifest applied to it, throw some error and terminate these steps.
2. Let `manifestUrl` be the URL of the manifest that has been applied to the [top-level browsing context](https://w3c.github.io/manifest/#dfn-top-level-browsing-context).
3. Set the value of a new internal slot [[manifestUrl]] in the `PaymentAppManifest` interface to `manifestUrl`.

### Pseudo code that is run on PaymentRequest.show()

This code is run by the browser in order to find all the Payment Apps and corresponding Payment Options that can handle a Payment Request.
