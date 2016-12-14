console.log("Running service worker");
self.addEventListener('paymentrequest', function(event) {
    console.log("PaymentRequest: " + JSON.stringify(event.data));
    window.open("https://tommythorsen.github.io/webpayments-demo/payment-apps/tommypay/app.html");
});
