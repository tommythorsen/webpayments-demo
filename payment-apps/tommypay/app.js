console.log("Running service worker");

self.addEventListener('paymentrequest', function(event) {
    console.log("PaymentRequest: " + JSON.stringify(event.data));
    event.respondWith(new Promise(function(resolve, reject) {
        self.addEventListener('message', function(event) {
            console.log("PaymentResponse: " + JSON.stringify(event.data));
            if (event.data) {
                resolve(event.data);
            } else {
                reject();
            }
        });
        clients.openWindow("app.html").then(function(windowClient) {
            console.log("window opened!");
            windowClient.postMessage(event.data);
        })
        .catch(function(error) {
            reject(error);
        });
    }));
});

