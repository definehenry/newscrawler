var cheerio = require('cheerio'),
	iconv = require('iconv-lite'),
	//Encoder = require('./encoder'),
	urlParser = require('url');


module.exports = function(url, config){
	return new NewsChosun(url, config);
};


var NewsChosun = function(url, config) {
    this.config = config;
    this.url = url;
    this.encoding = 'euc-kr';
};

var _ = NewsChosun.prototype;


_._parseTitle = function(data){

};

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
	if(dom && dom.find($('.par')).text())
		return dom.find($('.par')).text();
	
	dom = $('.article', '#content');
	if(dom){
		return dom.text();
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

