var appid = "wx2d1f71c689c30d70",
    secret = "e6a37cab4c17b16575b753483f6bdf69",
    url = "http://ssd3237649.xicp.net",
    token = "weixintoken";

var crypto = require('crypto');
var request = require('koa-request');

var config = require("config");

module.exports = function*(next) {
    var accessToken = yield getAccessToken();
    var ticket = yield getTicket(accessToken);
    var noncestr = getNoncestr(),timestamp = getTimestamp();
    var signature = getSignature(ticket,noncestr,timestamp);
    this.auth = {
    	appid: appid,
    	timestamp: timestamp,
    	noncestr:  noncestr,
    	signature: signature
    };
    yield next;
}


function* getAccessToken() {
    var options = {
        url: config.host.token,
        qs: {
            grant_type: "client_credential",
            appid: appid,
            secret: secret
        }
    };

    var response = yield request(options);
    var info = JSON.parse(response.body);
    return info.access_token;
}

function* getTicket(access_token) {
    var options = {
        url: config.host.ticket,
        qs: {
            access_token: access_token,
            type: "jsapi"
        }
    };

    var response = yield request(options); //Yay, HTTP requests with no callbacks! 
    var info = JSON.parse(response.body);
    return info.ticket;
}

function getSignature(ticket,noncestr,timestamp){
	var auth = {
        jsapi_ticket: ticket,
        noncestr: noncestr,
        timestamp: timestamp,
        url: config.host.ticket
    }
    var temp = [];
    for (var item in auth) {
        var s = item + "=" + auth[item];
        temp.push(s);
    }

    var authString = temp.join("&");
    var shasum = crypto.createHash('sha1');
    shasum.update(authString);

    return shasum.digest('hex');
}

function getNoncestr(){
	return Math.random().toString(36).substr(2, 15);
}

function getTimestamp(){
	return parseInt(new Date().getTime() / 1000) + '';
}