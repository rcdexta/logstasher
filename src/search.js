var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});


// App module
//
// The app module will contain all of the components the app needs (directives,
// controllers, services, etc.). Since it will be using the components within
// the elasticsearch module, define it a dependency.
var ExampleApp = angular.module('ExampleApp', ['elasticsearch', 'underscore', 'smart-table', 'ui.bootstrap', 'multi-select'])
    .directive('stRatio',function(){
        return {
            link:function(scope, element, attr){
                var ratio=+(attr.stRatio);

                element.css('width',ratio+'%');

            }
        }});

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

    $scope.formatRequestId = function(requestId){
        return requestId != undefined ? requestId.substring(0,8) : '';
    }

    $scope.source_apps = [
        { icon: '<img src="assets/images/ruby.png"/>', name: "pro-app-api",   ticked: true  },
        { icon: '<img src="assets/images/java.png"/>', name: "workflow-service", ticked: true}
    ];

    $scope.duration_options = [
        { label: 'Last 5m', value: 5 },
        { label: 'Last 15m', value: 15 },
        { label: 'Last 1h', value: 60 },
        { label: 'Last 3h', value: 180 },
        { label: 'Last 6h', value: 360 },
        { label: 'Last 12h', value: 720 },
        { label: 'Last 24h', value: 1440 },
    ];

    $scope.duration_in_mins = $scope.duration_options[0];

    $scope.fetchLogs = function(){
        var pageNum = 1;
        var perPage = 100;
        var utcOffset = clock.getUTCOffset($scope.duration_in_mins.value);

        client.search({
            index: 'logstash-2015.02.15',
            from: (pageNum - 1) * perPage,
            size: perPage,
            body: {
                "filter": {
                    "range": {
                        "@timestamp": {
                            "gte": utcOffset
                        }
                    }
                },
                sort : [
                    {"@timestamp" : {"order" : "asc"}}
                ]

            }
        }, function (error, response) {
            if (error) {
                // handle error
                return;
            }
            var results = _.pluck(response.hits.hits, '_source');
            $scope.results = _.map(results, function(elt){
                return {source: elt.source, request_id: elt['properties.x_request_id'],
                    timestamp: elt['@timestamp'], message: elt.message};
            });
        });
    };

    $scope.fetchLogs();

});