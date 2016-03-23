LogstasherApp.controller('LogController', function ($scope, client, esFactory, _, $activityIndicator, $location, $uibModal) {

  $scope.results = [];
  $scope.lastTimestamp = null;
  $scope.httpBusy = false;
  $scope.flag_404 = false;
  $scope.highlight_keyword = false;
  $scope.source_apps = $app_group;
  $scope.duration_options = $duration_options;
  $scope.advancedDuration = false;
  $scope.earliestTimestamp = null;

  $scope.search_filter = $location.search()['q'];

  $scope.showHelpModal = function(){
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: 'md'
    });
  }

  $scope.formatRequestId = function (requestId) {
    return requestId != undefined ? requestId.substring(0, 8) : '';
  };

  $scope.resetAndPaginate = function () {
    $scope.results = [];
    $scope.lastTimestamp = null;
    $scope.noMoreData = false;
    $scope.flag_404 = false;
    $scope.paginate().then(function(){
      $scope.earliestTimestamp = _.first($scope.results)['timestamp'];
      console.log($scope.earliestTimestamp);
    });

  };

  $scope.showRequest = function (x_request_id) {
    var url = window.location.href;
    if (url.indexOf('#?') != -1) {
      url = url.slice(0, url.indexOf('#?'));
    }
    window.open(url + '#?q=id:' + x_request_id + '&after=' + $scope.earliestTimestamp, '_blank');
  };

  if ($scope.search_filter) {
    var duration_from_url = $location.search()['d'];
    var selected_duration = _.findWhere($scope.duration_options, {value: parseInt(duration_from_url)});
    var selected_index = _.indexOf($scope.duration_options, selected_duration);
    var idx = selected_index == $scope.duration_options.length - 1 ? selected_index : selected_index + 1;
    $scope.duration_in_mins = $scope.duration_options[idx];
  }
  else {
    $scope.duration_in_mins = $scope.duration_options[1];
  }

  $scope.wrap = function ($event, that) {
    var elt = angular.element($event.currentTarget);
    elt.removeClass('nowrap');
  };

  $scope.paginate = function (firstCallFlag) {

    if ($scope.httpBusy) return;

    var pageNum = 1;
    var perPage = 100;

    if ($scope.search_filter && $scope.search_filter.indexOf("x_request_id:") != 0 && $scope.search_filter.indexOf("id:") != 0) {
      $scope.highlight_keyword = $scope.search_filter;
    } else {
      $scope.highlight_keyword = '';
    }

    if ($location.search()['after'] || $scope.after) {
        $scope.after = $scope.after || moment($location.search()['after']).toDate();
        console.log('datepicker value: ' + $scope.after.toISOString());
        $scope.absolute_timestamp = clock.parseLocalTime($scope.after.toISOString());
        console.log('$scope.absolute_timestamp: ' + $scope.absolute_timestamp);
        $scope.advancedDuration = true;
    }

    var filterBody = FilterBuilder()
      .withTimestamp(clock.elasticSearchFormat($scope.absolute_timestamp), $scope.lastTimestamp, $scope.duration_in_mins.value)
      .withApps($scope.source_apps)
      .withSearchFilter($scope.search_filter)
      .filter();

    $scope.httpBusy = true;
    $activityIndicator.startAnimating();

    var indices = clock.getIndicesForDuration($scope.absolute_timestamp, $scope.duration_in_mins.value);

    $scope.fetchLogsPromise = client.search({
      index: indices,
      from: (pageNum - 1) * perPage,
      size: perPage,
      body: filterBody
    }).then(function (response) {
      var results = _.pluck(response.hits.hits, '_source');
      if (results.length > 0) {
        $scope.results = $scope.results.concat(_.map(results, function (elt) {
          var request_id = elt['properties'] ? elt['properties']['x_request_id'] : '';
          if (elt.throwable) {
            elt.message += elt.throwable;
          }
          var actual_request_id = request_id === 'X-Request-Id-Undefined' ? '-' : request_id;
          var local_time = moment(Date.parse(elt['@timestamp'])).format('YYYY-MM-DDTHH:mm:ss.SSS');
          return {
            source: elt.source, request_id: actual_request_id,
            timestamp: local_time, message: elt.message, level: elt.level
          };
        }));
        $scope.fetch_count = $scope.results.length;
        $scope.lastTimestamp = _.last(results)['@timestamp'];
        if (!$scope.earliestTimestamp){
          $scope.earliestTimestamp = _.first(results)['@timestamp'];
        }
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

    return $scope.fetchLogsPromise;

  };

  $scope.isOpen = false;

  $scope.openCalendar = function(e) {
    e.preventDefault();
    e.stopPropagation();

    $scope.isOpen = true;
  };

  $scope.showSimpleDateWidget = function(){
    $scope.advancedDuration = false;
    $scope.after = null;
    $scope.absolute_timestamp = null;
  };

  $scope.showAdvancedDateWidget = function(){
    $scope.advancedDuration = true;
  }

});

LogstasherApp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
