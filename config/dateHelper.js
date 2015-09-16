'use strict';

module.exports = function(offset) {
	return new DateHelper(offset);
}

var DateHelper = function (offset) {
	this.offset = (offset === undefined) ? 0 : offset;
	this.oneDay = 3600000*24;
	this.oneHour = this.oneSecond * 60 * 60;
	this.oneSecond = 1000;
	this.currentTime = this._getCurrentTime(this.offset);
}

var _ = DateHelper.prototype;

_.getUTCToday = function() {
	return this._getCurrentTime(0);
};

_.getToday = function() {
	return this._getCurrentTime(this.offset);
};

_.getLastestSunday = function(){
	var dayOfToday = this.currentTime.getDay();
	var latestSunday = new Date(this.currentTime - (this.oneDay * dayOfToday));
	latestSunday.setHours(0);
	latestSunday.setMinutes(0);
	latestSunday.setSeconds(0);
	return latestSunday;
};

_.getNthSunday = function(n){
	return this.getNthWeek(n).start;
};

_.getDaysOfSunday = function(n) {
	var result = [];
	result[0] = this.getUTCToday();
	if(n > 0){
		for(var i = 1; i < n ; i++){
			result[i] = this.getNthSunday(i);
		}
	}
	return result;
};

_.getNthWeek = function(n){

	var dateOfSunday = this.getLastestSunday(),
		start = dateOfSunday - (n*this.oneDay*7),
		end = n === 0 ? this.currentTime : ((start + this.oneDay*7)-this.oneSecond);
		
	return {
		//start : this.format('yyyy-MM-dd HH:mm:ss',	new Date(start)), ///^\d{4}-\d{2}-\d{2}/.exec((new Date(start)).toJSON())[0],
		//end : this.format('yyyy-MM-dd HH:mm:ss',new Date(end))///^\d{4}-\d{2}-\d{2}/.exec((new Date(end)).toJSON())[0]
		start : new Date(start),
		end : new Date(end)
	}
};

_._getUTCTime = function(offset) {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);   
    var nd = new Date(utc + (3600000*offset));   
    return nd;
}

_._getCurrentTime = function(offset){
	// Newyork : -4

	return this._getUTCTime(offset);
}

_.format = function(f,d) {
	var h,
		that = this;

    if (!d.valueOf()) return " ";
     
    return f.replace(/(yyyy|yy|MM|dd|hh|mm|ss)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return that._zf((d.getFullYear() % 1000).toString(),2);
            case "MM": return that._zf((d.getMonth() + 1).toString(),2);
            case "dd": return that._zf((d.getDate()).toString(),2);
            case "HH": return that._zf((d.getHours()).toString(),2);
            case "hh": return that._zf((((h = d.getHours() % 12) ? h : 12)).toString(),2);
            case "mm": return that._zf((d.getMinutes()).toString(),2);
            case "ss": return that._zf((d.getSeconds()).toString(),2);
            default: return $1;
        }
    });
}

_._zf = function(strNum, len) {
	return this._string("0", len - strNum.length) + strNum;
}

_._string = function(str, len){
	var s = '', 
		i = 0; 
	while (i++ < len) { 
		s += str; 
	} 
	return s;
};