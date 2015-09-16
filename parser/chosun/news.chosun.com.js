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
};

var _ = NewsChosun.prototype;

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
	console.log('---------------NewsChosun init----------------');
    var that = this;
    that.loaded = cheerio.load(iconv.decode(buf, that._selectEncoding()), {
    	normalizeWhitespace: true,
   		xmlMode: true
    });
};

_.parseTitle = function(){
	var that = this,
		$ = that.loaded;
	return $('.news_title_text', '#csContent').find($('#news_title_text_id')).text();
};

_.parseArticle = function(){
	var that = this,
		$ = that.loaded;
    //console.log(buf);

    var result = [];
	var dom = null;

	dom = $('#news_body_id', '#csContent');
	if(dom)
		return dom.find($('.par')).html();

	else
		return 'parseArticle failed...';
};

_.parseAuthor = function(){
	var that = this,
		$ = that.loaded;
	return $('.news_title_text', '#csContent').find($('.news_title_author')).find('ul').text();
};

_.parseWrittenTime = function(){
	var that = this,
		$ = that.loaded;

	var written = $('#news_body_id', '#csContent').find($('#date_text')).text();
	var reg = /([1-9][0-9]{3}.[0-9]{2}.[0-9]{2} [0-9]{2}:[0-9]{2})/gm;
	var result = written.match(reg);

	if(!result)
		return null;
	else
		return new Date(result[0]);
};

_.parseModifiedTime = function(){
	var that = this,
		$ = that.loaded;	

	var written = $('#news_body_id', '#csContent').find($('#date_text')).text();
	var reg = /([1-9][0-9]{3}.[0-9]{2}.[0-9]{2} [0-9]{2}:[0-9]{2})/gm;
	var result = written.match(reg);

	if(!result[1])
		return null;
	else
		return new Date(result[1]);
};

_.parseCategory = function(){
	var that = this,
		$ = that.loaded;

	var dom = $('#csh_art_cat_id','#csHeader');
	return dom.text();
};

_.parseImage = function(){
	var that = this,
		$ = that.loaded;
	return $('#news_body_id', '#csContent').find('img').attr('src');
};

_.parsePaper = function(){
	var that = this,
		$ = that.loaded;
	return 0;
};

_.parseShare = function(){
	var that = this,
		$ = that.loaded,
		sns_sum = 0;
	var dom = $('.left_aside_sns', '#csContent').find('li');
	sns_sum += Number(dom.find($('.cmt')).find($('#BBSCNT')).text());
	sns_sum += Number(dom.find($('.fb')).find($('#FBCNT')).text());
	sns_sum += Number(dom.find($('.tw')).find($('#TWCNT')).text());
	return sns_sum;
};

