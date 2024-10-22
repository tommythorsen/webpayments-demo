var options = {
    requestPayerName: true,
    requestPayerEmail: true,
    requestPayerPhone: true,
    requestShipping: true
}

function getQueryParam(name) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    results = regex.exec(window.location.search);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function createDetails(item) {
    var details = {
        total: {
            label: "Total",
            amount: { currency: "USD", value: item.price }
        },
        displayItems: [
            {
                label: item.name,
                amount: { currency: "USD", value: item.price }
            }
        ],
        shippingOptions: [
            {
                id: "regular",
                label: "Regular snail-mail shipping",
                amount: { currency: "USD", value: "2.00" }
            },
            {
                id: "express",
                label: "Express shipping",
                amount: { currency: "USD", value: "5.00" }
            }
        ],
        modifiers: [
            {
                supportedMethods: [ "https://tommypay.no/pay" ],
                total: {
                    label: "Total (with TommyPay discount)",
                    amount: { currency: "USD", value: item.price - 1 }
                },
                additionalDisplayItems: [
                    {
                        label: "TommyPay discount",
                        amount: { currency: "USD", value: "-1" }
                    }
                ]
            }
        ]
    };
    return details;
}

function buy(item, methodData, notSupportedCallback) {
    try {
        var details = createDetails(item);
        var request = new PaymentRequest(methodData, details, options);
        request.addEventListener("shippingaddresschange", function(evt) {
            console.log("shipping address changed");
            console.log(JSON.stringify(evt));
            evt.updateWith(Promise.resolve(details));
        });
        request.addEventListener("shippingoptionchange", function(evt) {
            console.log("shipping option changed");
            console.log(JSON.stringify(evt));
            if (request.shippingOption === "regular") {
                details.shippingOptions[0].selected = true;
                details.shippingOptions[1].selected = false;
            } else {
                details.shippingOptions[0].selected = false;
                details.shippingOptions[1].selected = true;
            }
            evt.updateWith(Promise.resolve(details));
        });
        request.show()
        .then(function(paymentResponse) {
            console.log("payment response: " + JSON.stringify(paymentResponse));
            //console.log("  method name: " + paymentResponse.methodName);
            //console.log("  details: " + JSON.stringify(paymentResponse.details));
            //console.log("  payer name: " + paymentResponse.payerName);
            //console.log("  payer email: " + paymentResponse.payerEmail);
            //console.log("  payer phone: " + paymentResponse.payerPhone);
            if (paymentResponse) {
                window.location.href = "receipt.html?key=" + key;
            }
        })
        .catch(function(error) {
            console.log("show() error: " + error);
            if (notSupportedCallback) {
                notSupportedCallback(error);
            } else {
                window.alert(error);
            }
        });
    } catch(error) {
        window.alert(error);
    }
}

function buyWithAny(key) {
    var item = items[key];
    var methodData = [
        {
            supportedMethods: [
                "https://tommypay.no/pay",
                "https://rsolomakhin.github.io/bobpay",
                "basic-card", "mastercard", "visa"
            ]
        }
    ];

    buy(item, methodData);
}

function buyWithTommyPay(key) {
    var item = items[key];
    var methodData = [
        {
            supportedMethods: [ "https://tommypay.no/pay" ]
        }
    ];

    buy(item, methodData, function(error) {
        if (error.code == DOMException.NOT_SUPPORTED_ERR) {
            if (getQueryParam("buyWithTommyPay")) {
                return;
            }
            var redirectUrl = window.location.href;
            redirectUrl += redirectUrl.indexOf('?') == -1 ? '?' : '&';
            redirectUrl += "buyWithTommyPay=" + key;
            window.location.href =
                "https://tommythorsen.github.io/webpayments-demo/payment-apps/tommypay/signup/?redirect_url=" +
                encodeURI(redirectUrl);
        }
    });
}

function buyWithBobPay(key) {
    var item = items[key];
    var methodData = [
        {
            supportedMethods: [ "https://rsolomakhin.github.io/bobpay" ]
        }
    ];

    buy(item, methodData);
}

function buyWithCreditCard(key) {
    var item = items[key];
    var methodData = [
        {
            supportedMethods: [ "basic-card", "mastercard", "visa" ]
        }
    ];

    buy(item, methodData);
}

if (getQueryParam("buyWithTommyPay")) {
    buyWithTommyPay(getQueryParam("buyWithTommyPay"));
}

