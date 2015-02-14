var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});


// App module
//
// The app module will contain all of the components the app needs (directives,
// controllers, services, etc.). Since it will be using the components within
// the elasticsearch module, define it a dependency.
var ExampleApp = angular.module('ExampleApp', ['elasticsearch', 'underscore']);

// Service
//
// esFactory() creates a configured client instance. Turn that instance
// into a service so that it can be required by other parts of the application
ExampleApp.service('client', function (esFactory) {
    return esFactory({
        host: 'localhost:9200',
        apiVersion: '1.2',
        log: 'trace'
    });
});


// Controller
//
// It requires the "client" service, and fetches information about the server,
// it adds either an error or info about the server to $scope.
//
// It also requires the esFactory to that it can check for a specific type of
// error which might come back from the client
ExampleApp.controller('ExampleController', function ($scope, client, esFactory, _) {

    var pageNum = 1;
    var perPage = 100;

    client.search({
        index: 'logstash-2015.02.14',
        from: (pageNum - 1) * perPage,
        size: perPage,
        body: {
            query: {
                match: {
                    source: 'workflow-service'
                }
            },
            "filter": {
                "range": {
                    "@timestamp": {
                        "from": 1421913430965,
                        "to": 1423913730965
                    }
                }
            }
        }
    }, function (error, response) {
        if (error) {
            // handle error
            return;
        }
        var results = _.pluck(response.hits.hits, '_source');
        $scope.results = results;
    });

    // client.cluster.state({
    //   metric: [
    //     'cluster_name',
    //     'nodes',
    //     'master_node',
    //     'version'
    //   ]
    // })
    // .then(function (resp) {
    //   $scope.clusterState = resp;
    //   $scope.error = null;
    // })
    // .catch(function (err) {
    //   $scope.clusterState = null;
    //   $scope.error = err;

    //   // if the err is a NoConnections error, then the client was not able to
    //   // connect to elasticsearch. In that case, create a more detailed error
    //   // message
    //   if (err instanceof esFactory.errors.NoConnections) {
    //     $scope.error = new Error('Unable to connect to elasticsearch. ' +
    //       'Make sure that it is running and listening at http://localhost:9200');
    //   }
    // });

});