function appendPaymentApp(paymentApp) {
    var apps = document.getElementById("apps");
    var div = document.createElement("div");
    div.style.float = "left";
    div.style.clear = "left";
    div.innerHTML = '<h3 style="display: inline">' + paymentApp.name + '</h3>' +
        '<button style="float: right" id="pay">Pay</button>' +
        '<p>' + paymentApp.start_url + '</p>';
    div.querySelector("#pay").addEventListener('click', function() {
        location.href = paymentApp.start_url;
    });
    apps.appendChild(div);
}

chrome.storage.local.get(null, function(items) {
    var hasApps = false;
    for (var key in items) {
        appendPaymentApp(items[key]);
        hasApps = true;
    }
    if (!hasApps) {
        document.getElementById("empty").style.display = "block";
    }
});
