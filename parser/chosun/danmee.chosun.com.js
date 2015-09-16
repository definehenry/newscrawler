var cheerio = require('cheerio'),
	iconv = require('iconv-lite'),
	//Encoder = require('./encoder'),
	urlParser = require('url');


module.exports = function(url, config){
	return new DanmeeChosun(url, config);
};


var DanmeeChosun = function(url, config) {
    this.config = config;
    this.url = url;
};

var _ = DanmeeChosun.prototype;

_._selectEncoding = function(){
    var that = this,
        encoding = null;
    that.config.subdomain.some(function(subdomain){
        var re = new RegExp(subdomain);
        if(re.test(that.url)){             
            encoding = that.config.encoding[subdomain];
            return true;
        }
    });
    return encoding;
};

_.init = function(buf){
    console.log('---------------DanmeeChosun init----------------');
    var that = this;
    that.loaded = cheerio.load(iconv.decode(buf, that._selectEncoding()), {
    	normalizeWhitespace: true,
   		xmlMode: true
    });
};

_.parseTitle = function(){
    var that = this,
        $ = that.loaded;

    return $('#title_text','.title_author').text();
};

_.parseArticle = function(){
    var that = this,
        $ = that.loaded;

    var result = [];
	var dom = null;

	return $('#article', '#contentsarea').html();
};

_.parseAuthor = function(){
    var that = this,
        $ = that.loaded;

    return $('.art_title','#contentsarea').find($('#author','.title_author')).find('li').text();

};

_.parseWrittenTime = function(){
    var that = this,
        $ = that.loaded;
    var written = $('.date_ctrl', '#contentsarea').find($('#date_text')).text();
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
    var written = $('.date_ctrl', '#contentsarea').find($('#date_text')).text();
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
    return $('.art_title', '#contentsarea').find('em').find('a').text();
};

_.parseImage = function(){
    var that = this,
        $ = that.loaded;
    return $('#article', '#contentsarea').find('img').attr('src');

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
};

