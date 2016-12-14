console.log("Running service worker");
self.addEventListener('paymentrequest', function(event) {
    console.log("PaymentRequest: " + JSON.stringify(event.data));
    windowUrl = "https://tommythorsen.github.io/webpayments-demo/payment-apps/tommypay/app.html";
    Clients.openWindow(windowUrl).then(function(WindowClient) {
        console.log("window opened!");
    });
});
