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
            var term_filter = search_filter.match(/(\w+)\s*:\s*(\w+)/);
            if (term_filter){
                var filter_json = {};
                filter_json[term_filter[1]] = term_filter[2];
                this.searchFilter = {"term": filter_json};
            }
            else {
                var filter_json = {};
                filter_json['x_request_id'] = search_filter.split('-')[0];
                this.searchFilter = {"term": filter_json};
            }
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