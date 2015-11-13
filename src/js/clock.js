var clock = {

    getUTCOffset: function(interval_in_minutes){
        var utcOffset = moment().subtract(interval_in_minutes, 'minutes').utc();
        return this.elasticSearchFormat(utcOffset);
    },

    parseLocalTime: function(localTime){
      return this.elasticSearchFormat(moment(localTime).utc());
    },

    getDays: function(interval_in_minutes){
        var days = [];
        var utcOffset = moment().subtract(interval_in_minutes, 'minutes').utc();
        while(moment.utc().isAfter(utcOffset, 'day') || moment.utc().isSame(utcOffset, 'day')){
            days.push('logstash-' + utcOffset.utc().format("YYYY.MM.DD"));
            utcOffset.add(1, 'days');
        }
        return days.join(',')
    },

    elasticSearchFormat: function(moment_instance){
      return moment_instance.format("YYYY-MM-DDTHH:mm:ss.SSS\\Z");
    }
};
