console.log("Running service worker");
var paymentPromise;

self.addEventListener('paymentrequest', function(event) {
    console.log("PaymentRequest: " + JSON.stringify(event.data));
    paymentPromise = new Promise(function(resolve, reject) {
        windowUrl = "https://tommythorsen.github.io/webpayments-demo/payment-apps/tommypay/app.html";
        clients.openWindow(windowUrl).then(function(windowClient) {
            console.log("window opened!");
            windowClient.postMessage(event.data);
        });
    });
    event.respondWith(paymentPromise);
});

self.addEventListener('message', function(event) {
    console.log("PaymentResponse: " + JSON.stringify(event.data));
    if (event.data) {
        paymentPromise.resolve(event.data);
    } else {
        paymentPromise.reject();
    }
});
