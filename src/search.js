LogstasherApp.controller('ExampleController', function ($scope, client, esFactory, _, $activityIndicator) {

    $scope.results = [];
    $scope.lastTimestamp = null;
    $scope.httpBusy = false;

    $scope.formatRequestId = function (requestId) {
        return requestId != undefined ? requestId.substring(0, 8) : '';
    }

    $scope.source_apps = [
        {icon: '<img src="assets/images/ruby.png"/>', name: "pro-app-api", ticked: true},
        {icon: '<img src="assets/images/java.png"/>', name: "workflow-service", ticked: true}
    ];

    $scope.duration_options = [
        {label: 'Last 5m', value: 5},
        {label: 'Last 15m', value: 15},
        {label: 'Last 1h', value: 60},
        {label: 'Last 3h', value: 180},
        {label: 'Last 6h', value: 360},
        {label: 'Last 12h', value: 720},
        {label: 'Last 24h', value: 1440},
    ];

    $scope.duration_in_mins = $scope.duration_options[4];

    $scope.resetAndPaginate = function () {
        $scope.results = [];
        $scope.lastTimestamp = null;
        $scope.noMoreData = false;
        $scope.paginate();
    };

    $scope.paginate = function () {

        if ($scope.httpBusy) return;

        var pageNum = 1;
        var perPage = 100;

        var timestampFilter = $scope.lastTimestamp == null ?
        {"gte": clock.getUTCOffset($scope.duration_in_mins.value)} :
        {"gt": $scope.lastTimestamp};

        $scope.httpBusy = true;
        $activityIndicator.startAnimating();

        $scope.fetchLogsPromise = client.search({
            index: 'logstash-2015.02.15',
            from: (pageNum - 1) * perPage,
            size: perPage,
            body: {
                "filter": {
                    "range": {
                        "@timestamp": timestampFilter
                    }
                },
                sort: [
                    {"@timestamp": {"order": "asc"}}
                ]
            }
        }).then(function (response) {
            var results = _.pluck(response.hits.hits, '_source');
            if (results.length > 0) {
                $scope.results = $scope.results.concat(_.map(results, function (elt) {
                    return {
                        source: elt.source, request_id: elt['properties.x_request_id'],
                        timestamp: elt['@timestamp'], message: elt.message
                    };
                }));
                $scope.fetch_count = $scope.results.length;
                $scope.lastTimestamp = _.last(results)['@timestamp'];
            } else {
                $scope.noMoreData = true;
            }
            $scope.httpBusy = false;
            $activityIndicator.stopAnimating();
        }, function (error) {
            console.log(error);
        });
    };

});