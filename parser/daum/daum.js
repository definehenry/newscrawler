var cheerio = require('cheerio'),
	iconv = require('iconv-lite'),
	urlParser = require('url');


module.exports = function(url, config){
	return new Daum(url, config);
};


var Daum = function(url, config) {
    this.config = config;
    this.url = url;
};

var _ = Daum.prototype;

_.init = function(buf){
    var that = this;
    	console.log('---------------SearchChosun init----------------');	
    that.loaded = cheerio.load(iconv.decode(buf, that._selectEncoding()), {
    	normalizeWhitespace: true,
   		xmlMode: true
    });
};

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

_.parseURL = function(){
	var that = this,
		$ = that.loaded;

    var result = [];
	var dom = $('#newsResultUL', '#newsColl');
	//console.log(dom.html());
	dom = dom.find('li');
console.log('-------------------parseURL-----------------');	
	dom.each(function(index, elem){

		var link = $(this).find($('.wrap_tit')).find('a').attr('href');
		var title = $(this).find($('.wrap_tit')).find('a').text();
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

_.getNextPage = function(){
	var that = this,
		$ = that.loaded,
		result = [];

	for(var i = 2; i < 5; i++){
		//console.log('----------------------replace---------------------------- :' + page);
		//console.log(that.url);
		var link = that.url.replace(/&p=[0-9+]&/, '&p='+i+'&');
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
	}
	console.log(result);
	return result;

};

