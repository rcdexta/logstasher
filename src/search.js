LogstasherApp.controller('LogController', function ($scope, client, esFactory, _, $activityIndicator, $location) {

    $scope.results = [];
    $scope.lastTimestamp = null;
    $scope.httpBusy = false;
    $scope.flag_404 = false;

    $scope.formatRequestId = function (requestId) {
        return requestId != undefined ? requestId.substring(0, 8) : '';
    };

    $scope.source_apps = $app_group;
    $scope.duration_options = $duration_options;

    $scope.search_filter = $location.search()['q'];

    $scope.resetAndPaginate = function () {
        $scope.results = [];
        $scope.lastTimestamp = null;
        $scope.noMoreData = false;
        $scope.flag_404 = false;
        $scope.paginate();
    };

    $scope.showRequest = function(x_request_id){
        var url = window.location.href;
        if (url.indexOf('#?') != -1){
           url = url.slice(0, url.indexOf('#?'));
        }
        window.open(url + '#?q=x_request_id:' + x_request_id + '&d=' + $scope.duration_in_mins.value, '_blank');
    };

    if ($scope.search_filter){
        var duration_from_url = $location.search()['d'];
        var selected_duration = _.findWhere($scope.duration_options, {value: parseInt(duration_from_url)});
        var selected_index = _.indexOf($scope.duration_options, selected_duration);
        var idx = selected_index == $scope.duration_options.length - 1 ? selected_index : selected_index + 1;
        $scope.duration_in_mins = $scope.duration_options[idx];
    }
    else {
        $scope.duration_in_mins = $scope.duration_options[1];
    }

    $scope.wrap = function($event, that){
        var elt = angular.element($event.currentTarget);
        elt.removeClass('nowrap');
    };

    $scope.paginate = function () {

        if ($scope.httpBusy) return;

        var pageNum = 1;
        var perPage = 100;

        var filterBody = FilterBuilder()
            .withTimestamp($scope.lastTimestamp, $scope.duration_in_mins.value)
            .withApps($scope.source_apps)
            .withSearchFilter($scope.search_filter)
            .filter();

        $scope.httpBusy = true;
        $activityIndicator.startAnimating();

        var index_name = clock.getDays($scope.duration_in_mins.value);

        $scope.fetchLogsPromise = client.search({
            index: index_name,
            from: (pageNum - 1) * perPage,
            size: perPage,
            body: filterBody
        }).then(function (response) {
            var results = _.pluck(response.hits.hits, '_source');
            if (results.length > 0) {
                $scope.results = $scope.results.concat(_.map(results, function (elt) {
                    var request_id = elt['properties'] ? elt['properties']['x_request_id'] : '';
                    var actual_request_id = request_id === 'X-Request-Id-Undefined' ? '-' : request_id;
                    var local_time = moment(Date.parse(elt['@timestamp'])).format('YYYY-MM-DDTHH:mm:ss.SSS');
                    return {
                        source: elt.source, request_id: actual_request_id,
                        timestamp: local_time, message: elt.message, level: elt.level
                    };
                }));
                $scope.fetch_count = $scope.results.length;
                $scope.lastTimestamp = _.last(results)['@timestamp'];
                $scope.timezone = moment(Date.parse($scope.lastTimestamp)).format('Z');
            } else {
                $scope.noMoreData = true;
                if ($scope.lastTimestamp == null) {
                    $scope.flag_404 = true;
                }
            }
            $scope.httpBusy = false;
            $activityIndicator.stopAnimating();
        }, function (error) {
            console.log(error);
        });
    };

});