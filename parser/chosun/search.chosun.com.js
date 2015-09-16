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
	return encoding;
};

_.init = function(buf){
    var that = this;
    	console.log('---------------SearchChosun init----------------');	
    that.loaded = cheerio.load(iconv.decode(buf, that._selectEncoding()), {
    	normalizeWhitespace: true,
   		xmlMode: true
    });
};

_.getNextPage = function(){
	var that = this,
		$ = that.loaded;

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

_.parseURL = function(){
	var that = this,
		$ = that.loaded;

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

