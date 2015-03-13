var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});


var LogstasherApp = angular.module('LogstasherApp', ['elasticsearch', 'underscore', 'smart-table',
    'ui.bootstrap', 'multi-select', 'ngActivityIndicator', 'cgBusy'])
    .directive('stRatio',function(){
        return {
            link:function(scope, element, attr){
                var ratio=+(attr.stRatio);
                element.css('width',ratio+'%');
            }
        }});

angular.module('LogstasherApp').value('cgBusyDefaults',{
    message:'Loading Logs...',
    backdrop: true
});


LogstasherApp.service('client', function (esFactory) {
    return esFactory({
        host: 'logstasher.pro.com',
        apiVersion: '1.2',
        log: 'trace'
    });
});

var $app_group = [
    {icon: '<img src="assets/images/ruby.png"/>', name: "Blender", ticked: true},
    {icon: '<img src="assets/images/ruby.png"/>', name: "Cooper", ticked: true},
    {icon: '<img src="assets/images/ruby.png"/>', name: "ProAppApi", ticked: true},
    {icon: '<img src="assets/images/ruby.png"/>', name: "PushoverService", ticked: false},
    {icon: '<img src="assets/images/ruby.png"/>', name: "ProCentral", ticked: true},
    {icon: '<img src="assets/images/ruby.png"/>', name: "ProUi", ticked: true},
    {icon: '<img src="assets/images/java.png"/>', name: "CatalogService", ticked: true},
    {icon: '<img src="assets/images/java.png"/>', name: "Commodore", ticked: true},
    {icon: '<img src="assets/images/java.png"/>', name: "CoreService", ticked: true},
    {icon: '<img src="assets/images/java.png"/>', name: "CustomerIdentityService", ticked: true},
    {icon: '<img src="assets/images/java.png"/>', name: "CustomerOrderService", ticked: true},
    {icon: '<img src="assets/images/java.png"/>', name: "IdentityService", ticked: true},
    {icon: '<img src="assets/images/java.png"/>', name: "MagicListService", ticked: true},
    {icon: '<img src="assets/images/java.png"/>', name: "Timecop", ticked: false},
    {icon: '<img src="assets/images/java.png"/>', name: "WorkflowService", ticked: true}
];

var $duration_options = [
    {label: 'Last 5m', value: 5},
    {label: 'Last 10m', value: 10},
    {label: 'Last 30m', value: 30},
    {label: 'Last 1h', value: 60},
    {label: 'Last 3h', value: 180},
    {label: 'Last 6h', value: 360},
    {label: 'Last 12h', value: 720},
    {label: 'Last 24h', value: 1440},
    {label: 'Last 7d', value: 10080},
    {label: 'Last 30d', value: 43200}
];
