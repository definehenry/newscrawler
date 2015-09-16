var cheerio = require('cheerio'),
	iconv = require('iconv-lite'),
	//Encoder = require('./encoder'),
	urlParser = require('url');


module.exports = function(url, config){
	return new SearchChosun(url, config);
};


var SearchChosun = function(url, config) {
    this.config = config;
    this.url = url;
    this.encoding = 'utf-8';
};

var _ = SearchChosun.prototype;

_.getNextPage = function(buf){
	var that = this;
    $ = cheerio.load(iconv.decode(buf, that.encoding), {
    	normalizeWhitespace: true,
   		xmlMode: true
    });	

    var result = [];
	var dom = $('.result_box', '#csContent');
	dom = dom.find($('.pagelist','.pagination')).find('li');
			//console.log(result.html());
	dom.each(function(index, elem){

		var page = $(this).find('a').text();
		if(!page)
			return;
		//console.log('----------------------replace---------------------------- :' + page);
		//console.log(that.url);
		var link = that.url.replace(/pageno=[0-9+]/, 'pageno='+page);
		//console.log(link);
		//console.log('-------------------------------------------------------');
		//console.log($(this).find('dl').find('dt').find('a').attr('title'));

		//myCrawler.queueURL(link);
		if(link){
			var parsedURL = urlParser.parse(link);
			//that.crawler.queue.add(parsedURL.protocol,parsedURL.hostname,80,parsedURL.path);
			result.push(link);
		}
		//console.log($(this).find('dt').find('a').attr('href'));
		//console.log($(this).find($('.f_l')).attr('href'));
		//elem.find($('.fst')).find($('wrap_cont')).find($('cont_inner')).html()
	});
	return result;
};

_.parseURL = function(buf){
	var that = this;
    $ = cheerio.load(iconv.decode(buf, that.encoding), {
    	normalizeWhitespace: true,
   		xmlMode: true
    });

    var result = [];
	var dom = $('.result_box', '#csContent');
	//console.log(dom.text());
	dom = dom.find('dl');
	//console.log(dom.html());
	dom.each(function(index, elem){

		var link = $(this).find('dt').find('a').attr('href');
		var title = $(this).find('dt').find('a').text();
		//console.log(link);
		//console.log($(this).find('dl').find('dt').find('a').attr('title'));

		//myCrawler.queueURL(link);
		if(link){
			var parsedURL = urlParser.parse(link);
			//that.crawler.queue.add(parsedURL.protocol,parsedURL.hostname,80,parsedURL.path);
			result.push({
				title : title,
				link : link
			});
		}
		//console.log($(this).find('dt').find('a').attr('href'));
		//console.log($(this).find($('.f_l')).attr('href'));
		//elem.find($('.fst')).find($('wrap_cont')).find($('cont_inner')).html()
	});
	return result;
};

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

