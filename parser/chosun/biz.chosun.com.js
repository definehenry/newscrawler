var cheerio = require('cheerio'),
	iconv = require('iconv-lite'),
	//Encoder = require('./encoder'),
	urlParser = require('url');


module.exports = function(url, config){
	return new BizChosun(url, config);
};


var BizChosun = function(url, config) {
    this.config = config;
    this.url = url;
    this.encoding = 'utf-8';
};

var _ = BizChosun.prototype;


_.parseArticle = function(buf){
	var that = this;
    //console.log(buf);
    $ = cheerio.load(iconv.decode(buf, that.encoding), {
    	normalizeWhitespace: true,
   		xmlMode: true
    });

    var result = [];
	var dom = null;
console.log('get article of chosun');	

	dom = $('#news_body_id', '#csContent');
	if(dom && dom.find($('.par')).html())
		return dom.find($('.par')).html();
	
	dom = $('.article', '#content');
	if(dom){
		return dom.html();
	}
	else
		return 'parseArticle failed...';
};

_._parseAuthor = function(data){

};

_._parseWrittenTime = function(data){

};

_._parseModifiedTime = function(data){

};

_._parseCategory = function(data){

};

_._parseImage = function(data){

};

_._parsePaper = function(data){

};

_._parseShare = function(data){

};

