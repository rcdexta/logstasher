var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});


var LogstasherApp = angular.module('LogstasherApp', ['elasticsearch', 'underscore', 'smart-table',
    'ui.bootstrap', 'isteven-multi-select', 'ngActivityIndicator', 'cgBusy', 'ui.bootstrap.datetimepicker'])
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

angular
    .module('LogstasherApp')
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    });


LogstasherApp.service('client', function (esFactory) {
    return esFactory({
        host: 'https://logstasher-staging.pro.com',
        apiVersion: '1.2',
        log: 'trace',
        protocol: 'https'
    });
});

var $duration_options = [
    {label: 'Last 2m', value: 2},
    {label: 'Last 5m', value: 5},
    {label: 'Last 10m', value: 10},
    {label: 'Last 30m', value: 30},
    {label: 'Last 1h', value: 60},
    {label: 'Last 3h', value: 180},
    {label: 'Last 6h', value: 360},
    {label: 'Last 12h', value: 720},
    {label: 'Last 24h', value: 1440},
    {label: 'Last 3d', value: 4320},
    {label: 'Last 7d', value: 10080},
    {label: 'Last 30d', value: 43200},
    {label: 'Last 60d', value: 86400}
];
