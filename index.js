var request = require("request");
var method = LensClient.prototype;

function LensClient(parameters) {
    this.lensServerBaseUrl = parameters.lensServerBaseUrl;
    this.username = parameters.username;
    this.password = parameters.password;
    var lensClient = this;

    this.getSession = function (callback) {
        if (lensClient._session) {
            return callback(_session);
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
                url: lensClient.lensServerBaseUrl + "/queryapi/queries/" + handle,
                qs: {sessionid: sessionHandle}, headers: {
                    'accept': 'application/json'
                }
            }, function (error, response, body) {
                if(response && response.statusCode == 200) {
                    callback(JSON.parse(body));
                } else {
                    console.log("Error getting query status: " + error);
                }
            })
        })
    };
    this.executeAsync = function (sql) {

    }
}
module.exports = LensClient;



