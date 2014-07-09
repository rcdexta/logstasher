// we need to define the "elasticsearch" module as a dependency of our App module.
var ExampleApp = angular.module('ExampleApp', ['elasticsearch']);

ExampleApp.controller('ExampleController', function ($scope, esFactory) {
  var client = esFactory({
    host: 'localhost:9200'
  });

  client.info()
  .then(function (resp) {
    $scope.serverInfo = resp;
  })
  .catch(function (err) {
    if (err instanceof esFactory.errors.NoConnections) {
      $scope.error = new Error('Unable to connect to elasticsearch. Check that you can reach it at http://localhost:9200');
    } else {
      $scope.error = err.message;
    }
  });
});