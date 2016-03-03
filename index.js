var request = require("request");

function LensClient(parameters) {
    this.lensServerBaseUrl = parameters.lensServerBaseUrl;
    this.username = parameters.username;
    this.password = parameters.password;
    var lensClient = this;

    function getHttpCallbackFunction(successCallback, errorCallback) {
        return function (error, response, body) {
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

    this.invalidateSession = function (callback) {
        request.del({url: lensClient.lensServerBaseUrl + "session/", qs: {sessionid: lensClient._session}},
            getHttpCallbackFunction(callback)
        );
    };

    this.getSession = function (callback) {
        if (lensClient._session) {
            return callback(lensClient._session);
        } else {
            request.post({
                url: lensClient.lensServerBaseUrl + "session/",
                formData: {username: lensClient.username, password: lensClient.password}
            }, function (error, response, body) {
                if (response && response.statusCode == 200) {
                    lensClient._session = body;
                    callback(lensClient._session);
                } else {
                    console.error("Error getting session: " + error);
                }
            });
        }
    };
    this.getQuery = function (handle, callback) {
        this.getSession(function (sessionHandle) {
            request.get({
                url: lensClient.lensServerBaseUrl + "queryapi/queries/" + handle,
                qs: {sessionid: sessionHandle}, headers: {
                    'accept': 'application/json'
                }
            }, getHttpCallbackFunction(callback))
        })
    };
    this.listQueries = function (params, callback) {
        this.getSession(function (sessionHandle) {
            var qs = JSON.parse(JSON.stringify(params));
            qs['sessionid'] = sessionHandle;
            request.get({
                url: lensClient.lensServerBaseUrl + "queryapi/queries/",
                qs: qs, headers: {
                    'accept': 'application/json'
                }
            }, getHttpCallbackFunction(callback))
        })
    }
}
module.exports = LensClient;



