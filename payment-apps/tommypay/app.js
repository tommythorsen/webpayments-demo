console.log("Running service worker");

self.addEventListener('paymentrequest', function(event) {
    console.log("PaymentRequest: " + JSON.stringify(event.data));
    event.respondWith(new Promise(function(resolve, reject) {
        self.addEventListener('message', function(event) {
            console.log("PaymentResponse: " + JSON.stringify(event.data));
            if (event.data) {
                try {
                    resolve(event.data);
                } catch(error) {
                    console.log(error);
                    reject(error);
                }
            } else {
                reject();
            }
        });
        clients.openWindow("app.html").then(function(windowClient) {
            console.log("window opened!");
            windowClient.postMessage(event.data);
        })
        .catch(function(error) {
            console.log(error);
            reject(error);
        });
    }));
});

