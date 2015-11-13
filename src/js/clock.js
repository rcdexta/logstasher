var clock = {

    getUTCOffset: function(interval_in_minutes){
        var utcOffset = moment().subtract(interval_in_minutes, 'minutes').utc();
        return this.elasticSearchFormat(utcOffset);
    },

    parseLocalTime: function(localTime){
      return moment(localTime).utc();
    },

    getIndicesForDuration: function(timestamp_utc, interval_in_minutes){
        var days = [];
        var utcOffset = timestamp_utc ? timestamp_utc : moment().subtract(interval_in_minutes, 'minutes').utc();
        while(moment.utc().isAfter(utcOffset, 'day') || moment.utc().isSame(utcOffset, 'day')){
            days.push('logstash-' + utcOffset.format("YYYY.MM.DD"));
            utcOffset.add(1, 'days');
        }
        return days.join(',')
    },

    elasticSearchFormat: function(moment_instance){
      return moment_instance.format("YYYY-MM-DDTHH:mm:ss.SSS\\Z");
    }
};
