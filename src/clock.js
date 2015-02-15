var clock = {
    getUTCOffset: function(interval_in_minutes){
        var utcOffset = moment().subtract(interval_in_minutes, 'minutes').utc();
        return utcOffset.format("YYYY-MM-DDTHH:mm:ss.SSS\\Z")
    }
};