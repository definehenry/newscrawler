var cheerio = require('cheerio'),
	iconv = require('iconv-lite'),
	//Encoder = require('./encoder'),
	urlParser = require('url');


module.exports = function(url, config){
	return new Chosun(url, config);
};


var Chosun = function(url, config) {
    this.config = config;
    this.url = url;

   	this._setSubdominParser();
};

var _ = Chosun.prototype;

_._setSubdominParser = function(){
	var that = this,
		subdomain = null;
	that.config.subdomain.some(function(val){
		console.log(val);
		console.log(that.url);
		var re = new RegExp(val);
		if(re.test(that.url)){
			subdomain = val;
			return true;
		}
	});
	console.log('--------------------------------subdomain----------');
	console.log(subdomain);
	if(subdomain)
		this.domainParser = require('./'+subdomain)(that.url,that.config);
	else
		this.domainParser = null;
};

_.init = function(buf){
	if(this.domainParser){
		this.domainParser.init(buf);
		return true;
	}
	else
		return false;
};

_.parseURL = function(){
	return this.domainParser.parseURL();
};

_.getNextPage = function(){
	
	return this.domainParser.getNextPage();

};

_.parseTitle = function(){
	var that = this;

	return that.domainParser.parseTitle();
};

_.parseArticle = function(){
	var that = this;

	return that.domainParser.parseArticle();
};

_.parseAuthor = function(){
	var that = this;

	return that.domainParser.parseAuthor();
};

_.parseWrittenTime = function(){
	var that = this;

	return that.domainParser.parseWrittenTime();
};

_.parseModifiedTime = function(){
	var that = this;

	return that.domainParser.parseModifiedTime();
};

_.parseCategory = function(){
	var that = this;

	return that.domainParser.parseCategory();
};

_.parseImage = function(){
	var that = this;
	var result = that.domainParser.parseImage();
	return result ? result : '';
};

_.parsePaper = function(){
	var that = this;

	return that.domainParser.parsePaper();
};

_.parseShare = function(){
	var that = this;

	return that.domainParser.parseShare();
};

