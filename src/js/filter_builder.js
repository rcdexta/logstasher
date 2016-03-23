function FilterBuilder(){

    this.timestampFilter = null;
    this.sourceAppsFilter = {};
    this.levelsFilter = {};
    this.searchFilter = null;
    this.requestIdFilter = {};

    this.withTimestamp = function(absoluteTimestamp, lastTimestamp, duration_in_mins) {
      var tsFilter = lastTimestamp ? {"gt": lastTimestamp} :
        (absoluteTimestamp ? {"gte": absoluteTimestamp} : {"gte": clock.getUTCOffset(duration_in_mins)});

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

            var levelOperator = search_filter.match(/level\:(\w+)/, "");
            if (levelOperator){
              this.levelsFilter = {"terms":{"level": [levelOperator[1]]}};
              search_filter = search_filter.replace(/level\:(\w+)/, "");
            }

            if (search_filter.indexOf("x_request_id:") == 0 || search_filter.indexOf("id:") == 0){
                var filter_json = {};
                filter_json['x_request_id'] = search_filter.split(':')[1];
                this.requestIdFilter = {
                  "nested": {
                    "filter": {
                      "term": {
                        "properties.x_request_id": {
                          "value": filter_json['x_request_id']
                        }
                      }
                    },
                    "path": "properties"
                  }
                };
                search_filter = search_filter.replace(/id\:([a-z0-9-]+)/, "");
            }

            search_filter = search_filter.trim();

            if (search_filter != ''){
                this.searchFilter = {
                  "bool": {
                    "should": [
                      {"match": {
                        "message": {
                            "query": search_filter,
                            "operator": "and",
                            "minimum_should_match": "100%",
                            "type": "phrase"
                          }
                        }
                      },
                      {"match": {
                        "throwable": {
                            "query": search_filter,
                            "operator": "and",
                            "minimum_should_match": "100%",
                            "type": "phrase"
                          }
                        }
                      }
                    ],
                    "minimum_should_match": 1
                  }
                };
            }
        }
        return this;
    };

    this.filter = function(){
        var filters = {
                "filter": {
                    bool: {
                        must: [
                                this.timestampFilter,
                                this.sourceAppsFilter,
                                this.requestIdFilter,
                                this.levelsFilter
                            ]
                    }
                },
                sort: [
                    {"@timestamp": {"order": "asc"}}
                ]};
        if (this.searchFilter){
            filters['query'] = this.searchFilter;
        }
        return filters;
    };

    return this;
};
