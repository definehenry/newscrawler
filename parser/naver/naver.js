var cheerio = require('cheerio'),
	iconv = require('iconv-lite'),
	urlParser = require('url');


module.exports = function(url, config){
	return new Naver(url, config);
};


var Naver = function(url, config) {
    this.config = config;
    this.url = url;
};

var _ = Naver.prototype;

_._selectEncoding = function(){
	var that = this,
		encoding = null;
	that.config.subdomain.some(function(subdomain){
		var re = new RegExp(subdomain);
		if(re.test(that.url)){
	console.log('true');				
			encoding = that.config.encoding[subdomain];
			return true;
		}
	});
	console.log('-------------------_selectEncoding-----------------');
	console.log(encoding);
	return encoding;
};

_.parseURL = function(buf){
	var that = this;
    $ = cheerio.load(iconv.decode(buf, that._selectEncoding()), {
    	normalizeWhitespace: true,
   		xmlMode: true
    });

    var result = [];
	var dom = $('.srch_result_area', '.srch_content');
	//console.log(dom.html());
	dom = dom.find('ul');
	
	dom.each(function(index, elem){

		var link = $(this).find('li').find('a').attr('href');
		var title = $(this).find('li').find('a').text();
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

_.getNextPage = function(buf){
	var that = this;
    $ = cheerio.load(iconv.decode(buf, that._selectEncoding()), {
    	normalizeWhitespace: true,
   		xmlMode: true
    });	

    var result = [];
	var dom = $('.paging', '.srch_content').find('a');

	dom.each(function(index, elem){

		var link = $(this).attr('href');

		if(link){
			//var parsedURL = urlParser.parse(link);
			//that.crawler.queue.add(parsedURL.protocol,parsedURL.hostname,80,parsedURL.path);
			result.push('http://news.naver.com' + link);
		}
	});
	return result;

};

_._parseTitle = function(data){

};

_._parseArticle = function(data){

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

