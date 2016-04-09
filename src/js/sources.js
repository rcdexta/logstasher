var sources = {

  getAll: function (esClient) {

    var filterBody = {
      size: 0,
      aggs: {
        apps: {
          terms: {
            field: "source",
            size: 100
          }
        }
      }
    };

    var oneMonthInMins = 43200;

    var indices = clock.getIndicesForDuration(undefined, oneMonthInMins);

    return esClient.search({
      index: indices,
      body: filterBody
    });
    
  }

};
