# Payment Apps and Service Workers

There is currently consensus in the Web Payments Working Group that a Payment App should be a Web App that supports payments. We are still doing registration of Payment Options, and subscription to Payment Request Events, from Service Workers. Regardless of how Browser will choose to represent this in the UI, they will necessarily have to know something about the relationship between Payment Apps and Service Workers. Some discussion of this can be found from this comment onwards: https://github.com/w3c/webpayments-payment-apps-api/issues/98#issuecomment-277808484


## Debunking some common conceptions

*"Payment apps can be identified by origin"*

This is not the case. First, please consider the following three simple logical statements:

1. "Payment Apps are Web Apps." (This is by our own definition.)
1. "There may exist multiple Web Apps per origin." (I demonstrated this [here](https://github.com/w3c/webpayments-payment-apps-api/issues/98#issuecomment-277808484).)
1. The above two statements imply that: "There may exist multiple Payment Apps per origin."

Since there can be multiple Payment Apps per origin, it should be fairly obvious that the origin is not a good identifier for a Payment App.


*"Payment apps can be identified by scope"*

This is also not the case. First of all, a Web App does not even need to have a scope -- the scope can be [unbounded](https://www.w3.org/TR/appmanifest/#dfn-unbounded). Secondly, two Web Apps may have the same scope. Here are the red and blue Web Apps from before, moved into the same folder, and given manifests that define scope:

* http://people.opera.com/tommyt/purple/blue.html
* http://people.opera.com/tommyt/purple/red.html

These two Web Apps are in the same folder, and have the exact same scope, which shows that we can't rely on the Web App scope for any kind of identification or matching.


*"Service workers can be identified by scope"*

This one has been an accepted truth in the Working Group for some time, but after reading the [Service Workers specification](https://w3c.github.io/ServiceWorker/), I have come to believe that this is not true. Nowhere in the specification does it say that the scope of the Service Worker has to be unique. The Service Worker does however have a unique `id` field. Even though current implementations may only allow for one Service Worker per scope, [this issue](https://github.com/w3c/ServiceWorker/issues/921) leads me to think that we should assume this will always be the case.


## How Web Apps and Service Workers currently work

## Proposal
