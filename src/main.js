var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});

var LogstasherApp = angular.module('LogstasherApp', ['elasticsearch', 'underscore', 'smart-table',
    'ui.bootstrap', 'multi-select', 'ngActivityIndicator'])
    .directive('stRatio',function(){
        return {
            link:function(scope, element, attr){
                var ratio=+(attr.stRatio);
                element.css('width',ratio+'%');
            }
        }});

LogstasherApp.service('client', function (esFactory) {
    return esFactory({
        host: 'localhost:9200',
        apiVersion: '1.2',
        log: 'trace'
    });
});

var $app_group = [
    {icon: '<img src="assets/images/ruby.png"/>', name: "pro-app-api", ticked: true},
    {icon: '<img src="assets/images/java.png"/>', name: "workflow-service", ticked: true},
    {icon: '<img src="assets/images/java.png"/>', name: "identity-service", ticked: true},
    {icon: '<img src="assets/images/java.png"/>', name: "customer-order-service", ticked: true},
    {icon: '<img src="assets/images/java.png"/>', name: "customer-identity-service", ticked: true},
    {icon: '<img src="assets/images/java.png"/>', name: "worklow-service", ticked: true},
    {icon: '<img src="assets/images/java.png"/>', name: "magic-list-service", ticked: true},
    {icon: '<img src="assets/images/java.png"/>', name: "catalog-service", ticked: true},
];

var $duration_options = [
    {label: 'Last 5m', value: 5},
    {label: 'Last 15m', value: 15},
    {label: 'Last 1h', value: 60},
    {label: 'Last 3h', value: 180},
    {label: 'Last 6h', value: 360},
    {label: 'Last 12h', value: 720},
    {label: 'Last 24h', value: 1440},
];
