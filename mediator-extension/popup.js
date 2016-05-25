function appendPaymentApp(paymentApp) {
    var apps = document.getElementById("apps");
    var div = document.createElement("div");
    div.style.float = "left";
    div.style.clear = "left";
    div.innerHTML = '<h3 style="display: inline">' + paymentApp.name + '</h3>' +
        '<button style="float: right" id="delete">Delete</button>' +
        '<p>Supported methods: <tt>' + paymentApp.enabled_methods.join(", ") + '</tt></p>' +
        '<p><a href="' + paymentApp.start_url + '">' + paymentApp.start_url + '</a></p>';
    div.querySelector("#delete").addEventListener('click', function() {
        chrome.storage.local.remove(paymentApp.start_url);
        location.reload();
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
