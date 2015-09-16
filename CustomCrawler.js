var Crawler = require("./node_modules/simplecrawler/lib"),
	cheerio = require('cheerio'),
	iconv = require('iconv-lite'),
	cp949 = require('./cp949'),
	dateHelper = require('./config/dateHelper')(),
	mysql = require('mysql'),
	sprintf = require('sprintf'),
	urlParser = require('url');


module.exports = function(config,keyword){
	return new CustomCrawler(config,keyword);
};


var CustomCrawler = function(config,keyword) {
	this.config = config;
	this.conn = mysql.createConnection({
		host            : 'magi.wantreez.com',
		user            : 'root',
		port			: '3333',
		password        : 'qwe123',
		database		: 'media'
	});
	this.keyword = {};
	this.keyword[config.naver.name] = cp949(encodeURI(keyword,config.naver.keywordEncoding));
	this.keyword[config.news.name] = encodeURI(keyword,config.news.keywordEncoding);

	this.crawler = new Crawler(config.url);
	this.crawler.maxDepth = 2;
	this.crawler.interval = 3000;
	this.crawler.acceptCookies = true;
	this.crawler.maxConcurrency = 2;
//	this.crawler.initialPath = config.initialPath + this.keyword + config.dateQuery;
//	this.crawler.initialProtocol = config.initialProtocol;
//	this.crawler.customHeaders = 
	this._setHandler();
};

var _ = CustomCrawler.prototype;

_.start = function(){
	var that = this;
	that.crawler.queue.add('http',that.config.naver.host,80, that.config.naver.path + that.keyword[that.config.naver.name] + that.config.naver.dateQuery, 1, that.config.naver.headers, function(err, result){
		console.log(result);
	});

	//that.crawler.queue.add('http',that.config.news.host, 80, that.config.news.path + that.keyword[that.config.news.name] + that.config.news.dateQuery, 1, that.config.news.headers, function(err, result){
	//	console.log(result);
	//});

//	that.crawler.queue.add('http',that.config.host,80,parsedURL.path, 1, function(err, result){

//console.log(that.crawler.queue);
	that.conn.connect(function(err){
		if(err){
			console.log(err);
			return;
		}
		that.crawler.start();
	});
	
};


_._selectDomain = function(str){
	var that = this;
	if(that.config.naver.pattern.test(str)){
		console.log('---------------------naver');
		return {
			parser : require('./parser/'+that.config.naver.name+'/'+that.config.naver.name)(str, that.config.naver),
			domain : that.config.naver
		};
	}
	else if(that.config.news.pattern.test(str)){
		console.log('-----------------chosun');
		return {
			parser : require('./parser/'+that.config.news.name+'/'+that.config.news.name)(str, that.config.news),
			domain : that.config.news
		};
	}
	else{
		console.log('-----------------none' + str);
		console.log(str);
		return {
			parser : null,
			domain : null
		};
	}
};


function mysqlEscape(stringToEscape){
    if(stringToEscape == '') {
        return stringToEscape;
    }

    return stringToEscape
        .replace(/\\/g, "\\\\")
        .replace(/\'/g, "\\\'")
        .replace(/\"/g, "\\\"")
        .replace(/\n/g, "\\\n")
        .replace(/\r/g, "\\\r")
        .replace(/\x00/g, "\\\x00")
        .replace(/\x1a/g, "\\\x1a");
};

_._setHandler = function(){
	var that = this;
	that.crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
		//console.log(queueItem);
	    console.log("(%d)I just received %s(%d) (%d bytes)", queueItem.depth, queueItem.url, responseBuffer.length);
	    console.log("It was a resource of type %s", response.headers['content-type']);
	//str = "<ul id=\"fruits\"><li class=\"apple\">Apple</li><li class=\"orange\">Orange</li><li class=\"pear\">Pear</li></ul>";

		var parser = null;

		if(queueItem.depth == 1){
console.log('------------------------------depth 1------------------------');			
			
			var domain = that._selectDomain(queueItem.url);
			//console.log(domain);
			parser = domain.parser;
			if(!parser)
				return;
			var data = parser.parseURL(responseBuffer);
		    console.log(data);
		    data.forEach(function(val){
		    	var parsedURL = urlParser.parse(val.link);
		    	//console.log(parsedURL);
				that.crawler.queue.add('http',parsedURL.host,80,parsedURL.path,2, domain.headers, function(err, result){
					if(err)
						console.log(err);
					else{
						//console.log('--------------------queue added------------------------');
						//console.log(result);
						//console.log('-------------------------------------------------------');
					}
				}); 
		    });
		    //console.log(data);
		    var arrPage = parser.getNextPage(responseBuffer);
		    console.log('--------------------getNextPage------------------------');
		    //console.log(arrPage);
		    console.log('--------------------------------------------');
		    arrPage.forEach(function(link){
		    	//console.log(link);
		    	var parsedURL = urlParser.parse(link);
		    	//console.log(parsedURL);
				that.crawler.queue.add(parsedURL.protocol,parsedURL.host,80,parsedURL.path, 1, domain.headers, function(err, result){
					if(err)
						console.log(err);
					else{
						//console.log('--------------------queue added------------------------');
						//console.log(result);
						//console.log('-------------------------------------------------------');

					}
				});
		    });
		}
		else{
			var d = dateHelper.format('yyyy-MM-dd hh:mm:ss', new Date());
			var domain = that._selectDomain(queueItem.url);
			parser = domain.parser;
			var article = parser.parseArticle(responseBuffer);
			console.log(article);
			var q_insert = "insert into chosun(date,keyword,url,title,article,author,written_ts,modified_ts,category,image,paper,share,reg_ts) values(\'%s\',`%s`,`%s`,`%s`,\"%s\",`%s`,\'%s\',\'%s\',`%s`,`%s`,%s,%s,\'%s\')";
			q_insert = sprintf(q_insert,d,'keyword','url','title',mysql.escape(article) ,'author',d,d,'category','image',1,1,d);
			console.log(q_insert);
			that.conn.query(q_insert,function(err, result){
				if(err){
					console.log(err);
				}
				else
					console.log(result);
			});
		}



	});

	that.crawler.on("fetchdataerror", function(queueItem, response){
		console.log("fetchdataerror");
		//console.log(response);
	});

	that.crawler.on("queueduplicate", function(URLData){
		console.log("queueduplicate");
		console.log(URLData);
	});

	that.crawler.on("fetch404", function(queueItem, response){
		console.log("fetch404");
		//console.log(queueItem);
	});

	that.crawler.on("fetcherror", function(queueItem, response){
		console.log("fetcherror");
		console.log(queueItem);
		//console.log(response);
	});

	that.crawler.on("gziperror", function(queueItem, error, response){
		console.log("gziperror");
		//console.log(response);
	});

	that.crawler.on("fetchtimeout", function(queueItem, crawlerTimeoutValue){
		console.log("fetchtimeout");
		//console.log(crawlerTimeoutValue);
	});

	that.crawler.on("fetchclienterror", function(queueItem, errorData){
		console.log("fetchclienterror");
		//console.log(errorData);
	});

	that.crawler.on("discoverycomplete", function(queueItem, resources){
		console.log("discoverycomplete");
		//console.log(queueItem);
		//console.log(myCrawler.queue);
	});

	that.crawler.on("complete", function(){
		console.log("complete");
		that.conn.end(function(err){
			if(err){
				console.log(err);
			}
		});
	});
};






