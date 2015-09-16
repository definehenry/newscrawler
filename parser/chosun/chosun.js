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
	this.domainParser = require('./'+subdomain)(that.url,that.config);
};

_.parseURL = function(buf){
	return this.domainParser.parseURL(buf);

	/*var that = this;
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
	return result;*/
};

_.getNextPage = function(buf){
	
	return this.domainParser.getNextPage(buf);

	/*var that = this;
    $ = cheerio.load(iconv.decode(buf, that._selectEncoding()), {
    	normalizeWhitespace: true,
   		xmlMode: true
    });	

    var result = [];
	var dom = $('.main_pack', '#container');
			//console.log(result.html());
	var anchor = dom.find($('.paging','#main_pack')).find('.next');
			//console.log(result);
	if(anchor)
		return 'http:' + anchor.attr('href');
	else
		return null;*/
};

_._parseTitle = function(data){

};

_.parseArticle = function(buf){
	var that = this;

	return that.domainParser.parseArticle(buf);

    //console.log(buf);
   /* $ = cheerio.load(iconv.decode(buf, that._selectEncoding()), {
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
		return 'parseArticle failed...';*/
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

