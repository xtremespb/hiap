const axios = require("axios");
const crypto = require("crypto");

module.exports = class {
    constructor(config) {
        this.config = config;
    }

    async getAppAccessToken() {
        try {
            const data = new URLSearchParams();
            data.append("grant_type", "client_credentials");
            data.append("client_secret", this.config.clientSecret);
            data.append("client_id", this.config.clientId);
            const res = await axios({
                method: "post",
                url: this.config.authURL,
                data
            });
            return res.data.access_token;
        } catch (e) {
            return e;
        }
    }

    verifyPurchaseData(data, signature) {
        try {
            const publicKey = `-----BEGIN PUBLIC KEY-----\n${this.config.publicKey}\n-----END PUBLIC KEY-----`;
            const verifier = crypto.createVerify("sha256WithRSAEncryption");
            verifier.update(new Buffer.from(data, "base64"));
            return verifier.verify(publicKey, signature);
        } catch (e) {
            return e;
        }
    }

    async verifyProduct(productId, purchaseToken, repeat = false) {
        try {
            const token = repeat || !this.token ? await this.getAppAccessToken() : this.token;
            const res = await axios({
                method: "post",
                url: `${this.config.ordersURL}/applications/purchases/tokens/verify`,
                data: {
                    productId,
                    purchaseToken,
                },
                headers: {
                    // eslint-disable-next-line new-cap
                    authorization: `Basic ${new Buffer.from(`APPAT:${token}`).toString("base64")}`
                }
            });
            if (res.data.responseCode === "0") {
                return {
                    ...res.data,
                    purchaseTokenData: JSON.parse(res.data.purchaseTokenData),
                    responseCode: parseInt(res.data.responseCode, 10)
                };
            }
            return res.data;
        } catch (e) {
            if (e && e.response && e.response.data && e.response.data.responseCode === "6" && !repeat) {
                return this.verifyProduct(productId, purchaseToken, true);
            }
            return e;
        }
    }

    async getCancelledProducts(startAt = parseInt(new Date().getTime() / 1000, 10) - 2592000, maxRows = 1000, continuationToken, type = 0, repeat) {
        try {
            const token = repeat || !this.token ? await this.getAppAccessToken() : this.token;
            const res = await axios({
                method: "post",
                url: `${this.config.ordersURL}/applications/v2/purchases/cancelledList`,
                data: {
                    type,
                    startAt,
                    maxRows,
                    continuationToken,
                },
                headers: {
                    // eslint-disable-next-line new-cap
                    authorization: `Basic ${new Buffer.from(`APPAT:${token}`).toString("base64")}`
                }
            });
            if (res.data.responseCode === "0") {
                return {
                    ...res.data,
                    responseCode: parseInt(res.data.responseCode, 10)
                };
            }
            return res.data;
        } catch (e) {
            if (e && e.response && e.response.data && e.response.data.responseCode === "6" && !repeat) {
                return this.getCancelledProducts(startAt, maxRows, continuationToken, true);
            }
            return e;
        }
    }
}