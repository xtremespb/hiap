# Huawei In-App Purchase (IAP) Server Tools

A set of server tools that allows you to check products purchased by the user in the application.

Install from NPM:

```npm i hiap --save```

Use in your code:

```javascript
const HIAP = require("hiap");
const hiap = new HIAP({
    "authURL": "https://oauth-login.cloud.huawei.com/oauth2/v2/token",
    "ordersURL": "https://orders-drru.iap.hicloud.com",
    "clientId": "123456789",
    "clientSecret": "secret key string",
    "publicKey": "public key string"
});
const token = hiap.getAppAccessToken();
console.log(token);
```

Methods available:

* async **getAppAccessToken()**
* verifyPurchaseData(data, signature)
* async **verifyProduct**(productId, purchaseToken, repeat = false)
* async **getCancelledProducts**(startAt = parseInt(new Date().getTime() / 1000, 10) - 2592000, maxRows = 1000, continuationToken, type = 0, repeat)

## getAppAccessToken
*Method is async*.

This method is used to obtain an authorization token from the Huawei server.

Parameters:

* No parameters

Returns:

* A token string when operation is successful, error otherwise.  

## verifyPurchaseData

The method is used to verify the received purchase data and the corresponding signature.

Parameters (*all parameters are mandatory*):

* **productId** is a string which indicates the desired Product ID
* **signature** is a signature string received on purchase

Returns:

* Either **true** or **false**
* More information: [Huawei Developers](https://developer.huawei.com/consumer/en/doc/development/HMS-References/iap-obtain-application-level-AT-v4)

## verifyProduct

The method is used to check the availability of purchase data on the Huawei side.
*Method is async*.

Parameters (*all parameters are mandatory*):

* **productId** is a string which indicates the desired Product ID
* **purchaseToken** is a purchase token string received from Huawei side

Returns:

* Objects which includes the **purchaseTokenData** if successful, error otherwise
* More information: [Huawei Developers](https://developer.huawei.com/consumer/en/doc/development/HMS-References/iap-api-order-service-purchase-token-verification-v4)

## getCancelledProducts

The method is used to get a list of canceled purchases. 
*Method is async*.

Parameters (*all parameters are optional*):

* **startAt** is a Timestamp (UTC) of the earliest canceled or refunded purchase that you want to query; if continuationToken is passed, startAt is ignored; the default value is the current timestamp minus 1 month
* **maxRows** is a maximum number of query result records, the value is greater than 0; the default value and the maximum value are 1000
* **type** is a query type (0 = query purchase information about consumables and non-consumables, 1 = query information about consumables, non-consumables, and subscriptions); ignored when continuationToken is passed
* **continuationToken** is a token returned in the last query to query the data on the next page

Returns:

* Objects which includes the **cancelledPurchaseList** array if successful, error otherwise
* If the token **continuationToken** is returned, another query is required
* More information: [Huawei Developers](https://developer.huawei.com/consumer/en/doc/development/HMS-References/iap-api-cancel-or-refund-record-v4)