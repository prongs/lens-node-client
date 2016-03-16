# lens-node-client

A client wrapper over the Apache lens [REST API](http://lens.apache.org/rest.html). 

It's a work in progress and might not be complete. The development for this is driven by [lens-slack-bot](https://github.com/prongs/lens-slack-bot), which is a chat-bot application built on top of this and [botkit](https://github.com/howdyai/botkit/).  

## Usages

    var LensClient = require("lens-node-client");
    var client = new LensClient({
            lensServerBaseUrl: "http://lens-installation/lensapi/",
            username: "username for loggging in"
            password: "password for logging in"
        });
    // Get a query given a handle
    client.getQuery(handle, function (query) {
        // query is a javascript object, json equivalent would be http://lens.apache.org/el_ns0_lensQuery.html
        console.log(query)
    });
    
    // List running queries
    var filter = {};
    // construct filter as key-value pairs. The possible parameters mentioned at http://lens.apache.org/resource_QueryServiceResource.html#path__queryapi_queries.html
    // e.g. 
    filter = {user:"all", state:"RUNNING"}
    client.listQueries(filter, function(queries){
        // queries is a List of QueryHandle objects     
        // Sample operation:
        queries.forEach(function(query){
            console.log(query.queryHandle.handleId);
            console.log(query.status);
        });
    });
    

For a sample application, check-out [lens-slack-bot](https://github.com/prongs/lens-slack-bot).

## Contributing

* Fork it
* Add/change code
* Raise a pull-request
* Star it :)