function FilterBuilder(){

    this.timestampFilter = null;
    this.sourceAppsFilter = {};
    this.searchFilter = {};

    this.withTimestamp = function(lastTimestamp, duration_in_mins) {
        var tsFilter = lastTimestamp == null ?
            {"gte": clock.getUTCOffset(duration_in_mins)} :
            {"gt": lastTimestamp};
        this.timestampFilter = {
            "range": {
                "@timestamp": tsFilter
            }
        };
        return this;
    };

    this.withApps = function(source_apps){
        var total_count = source_apps.length;
        var ticked_apps = _.filter(source_apps, function(elt) { return elt.ticked });
        if (total_count != ticked_apps.length) {
            var selected_apps = _.map(ticked_apps, function(elt) {
                return elt.name.toLowerCase();
            });
            this.sourceAppsFilter = {"terms":{"source": selected_apps}};
        }
        return this;
    };

    this.withSearchFilter = function(search_filter){
        if (search_filter != undefined && search_filter != ''){
            var request_id = search_filter.match(/request-id\s*:\s*(\w+)/)[1];
            this.searchFilter = {"term":{"x_request_id": request_id}};
        }
        return this;
    };

    this.filter = function(){
        return {"filter": {
                    bool: {
                        must: [
                                this.timestampFilter,
                                this.sourceAppsFilter,
                                this.searchFilter
                            ]
                    }
                },
                sort: [
                    {"@timestamp": {"order": "asc"}}
                ]};
    };

    return this;
};