"use strict";
var request = require("request");

class LensClient {
  constructor(parameters) {
    this.lensServerBaseUrl = parameters.lensServerBaseUrl;
    this.username = parameters.username;
    this.password = parameters.password;
  }

  getHttpCallbackFunction(successCallback, errorCallback) {
    return (error, response, body) => {
      if (response && response.statusCode == 200) {
        successCallback(JSON.parse(body));
      } else {
        console.error(error);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    }
  }

  invalidateSession (callback) {
    request.del({url: this.lensServerBaseUrl + "session/", qs: {sessionid: this._session}},
      this.getHttpCallbackFunction(callback)
    );
  }

  getSession (callback) {
    if (this._session) {
      return callback(this._session);
    } else {
      request.post({
        url: this.lensServerBaseUrl + "session/",
        headers: {
          'accept': 'application/xml'
        },
        formData: {username: this.username, password: this.password, sessionconf: "<conf></conf>"}
      }, (error, response, body) => {
        if (response && response.statusCode == 200) {
          this._session = body;
          callback(this._session);
        } else {
          console.error("Error getting session: " + error);
        }
      });
    }
  }
  getQuery (handle, successCallBack, failureCallBack) {
    this.getSession((sessionHandle) => {
      request.get({
        url: this.lensServerBaseUrl + "queryapi/queries/" + handle,
        qs: {sessionid: sessionHandle}, headers: {
          'accept': 'application/json'
        }
      }, this.getHttpCallbackFunction(successCallBack, failureCallBack))
    })
  }

  listQueries (params, successCallBack, failureCallBack) {
    this.getSession((sessionHandle) => {
      var qs = JSON.parse(JSON.stringify(params));
      qs['sessionid'] = sessionHandle;
      request.get({
        url: this.lensServerBaseUrl + "queryapi/queries/",
        qs: qs, headers: {
          'accept': 'application/json'
        }
      }, this.getHttpCallbackFunction(successCallBack, failureCallBack))
    })
  }
}
module.exports = LensClient;



