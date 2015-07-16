var clock = {
    getUTCOffset: function(interval_in_minutes){
        var utcOffset = moment().subtract(interval_in_minutes, 'minutes').utc();
        return utcOffset.format("YYYY-MM-DDTHH:mm:ss.SSS\\Z")
    },
    getDays: function(interval_in_minutes){
        var days = [];
        var utcOffset = moment().subtract(interval_in_minutes, 'minutes').utc();
        while(moment.utc().isAfter(utcOffset, 'day') || moment.utc().isSame(utcOffset, 'day')){
            days.push('logstash-' + utcOffset.utc().format("YYYY.MM.DD"));
            utcOffset.add(1, 'days');
        }
        return days.join(',')
    }
};