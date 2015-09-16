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
};

var _ = BizChosun.prototype;

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

_.init = function(buf){
	console.log('---------------Biz init----------------');
    var that = this;
    that.loaded = cheerio.load(iconv.decode(buf, that._selectEncoding()), {
    	normalizeWhitespace: true,
   		xmlMode: true
    });
};

_.parseTitle = function(){
	var that = this,
		$ = that.loaded;

	return $('.title_author_2011', '#content').find($('#title_text')).text();
};

_.parseArticle = function(){
	var that = this,
		$ = that.loaded;
    //console.log(buf);

    var result = [];
	var dom = null;

	console.log('get article of chosun');	

//	dom = $('#news_body_id', '#csContent');
//	if(dom && dom.find($('.par')).html())
//		return dom.find($('.par')).html();
	dom = $('.article', '#content');
	if(dom){
		return dom.html();
	}
	else
		return 'parseArticle failed...';
};

_.parseAuthor = function(){
    var that = this,
		$ = that.loaded;

    var result = [];
	return $('.title_author_2011', '#content').find('li').text();
};

_.parseWrittenTime = function(){
    var that = this,
		$ = that.loaded;

	var written = $('.date_ctrl_2011', '#content').text();
	var reg = /([1-9][0-9]{3}.[0-9]{2}.[0-9]{2} [0-9]{2}:[0-9]{2})/gm;
	var result = written.match(reg);
	if(!result)
		return null;
	else
		return new Date(result[0]);
	//written = wriiten.replace("입력 : ","");
};

_.parseModifiedTime = function(){
    var that = this,
		$ = that.loaded;	
	var written = $('.date_ctrl_2011', '#content').text();
	var reg = /([1-9][0-9]{3}.[0-9]{2}.[0-9]{2} [0-9]{2}:[0-9]{2})/gm;
	var result = written.match(reg);
	if(!result[1])
		return null;
	else
		return new Date(result[1]);	//written = wriiten.replace("입력 : ","");
};

_.parseCategory = function(){
    var that = this,
		$ = that.loaded;	
	return $('.art_title_2011', '#content').find('dl').find('dt').find('a').text();
};

_.parseImage = function(){
    var that = this,
		$ = that.loaded;		
	return $('.article', '#content').find('img').attr('src');
};

_.parsePaper = function(){
    var that = this,
		$ = that.loaded;		
	return 0;
};

_.parseShare = function(){
    var that = this,
		$ = that.loaded;		
	return -1;
	//return $('#article_sns2014', '#content').find('iframe').attr('src');
};

