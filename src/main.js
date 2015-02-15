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

