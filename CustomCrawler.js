var Crawler = require("simplecrawler"),
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
	this.visitedTitle = [];
	this.conn = mysql.createConnection({
		host            : 'magi.wantreez.com',
		user            : 'root',
		port			: '3333',
		password        : 'qwe123',
		database		: 'media'
	});
	this.keyword = {};
	this.keyword['raw'] = keyword;
	this.keyword[config.naver.name] = cp949(encodeURI(keyword,config.naver.keywordEncoding));
	this.keyword[config.daum.name] = encodeURI(keyword,config.daum.keywordEncoding);
	this.keyword[config.news.name] = encodeURI(keyword,config.news.keywordEncoding);

	this.crawler = new Crawler(config.url);
	this.crawler.maxDepth = 2;
	this.crawler.interval = 3000;
	this.crawler.acceptCookies = true;
	this.crawler.maxConcurrency = 3;
//	this.crawler.initialPath = config.initialPath + this.keyword + config.dateQuery;
//	this.crawler.initialProtocol = config.initialProtocol;
//	this.crawler.customHeaders = 

	this._setWrapper(this.crawler, "discoverResources", function(original,resourceData,queueItem){
		return [];
	});
	this._setWrapper(this.crawler, "queueLinkedItems", function(original,resourceData,queueItem,decompressed){
		return this;
	});
	
	this._setHandler();
};

var _ = CustomCrawler.prototype;

_._setWrapper = function(object, method, wrapperFunc) {
	var fn = object[method];

	return object[method] = function() {
		return wrapperFunc.apply(this, [fn.bind(this)].concat(Array.prototype.slice.call(arguments)));
	};
};

_.startFromSeeds = function(){
	var that = this;
	that.crawler.queue.add('http',that.config.naver.host,80, that.config.naver.path + that.keyword[that.config.naver.name] + that.config.naver.dateQuery, 1, function(err, result){
		console.log(result);
	});
	that.crawler.queue.add('http',that.config.daum.host, 80, that.config.daum.path + that.keyword[that.config.daum.name] + that.config.daum.dateQuery, 1, function(err, result){
		console.log(result);
	});
	that.crawler.queue.add('http',that.config.news.host, 80, that.config.news.path + that.keyword[that.config.news.name] + that.config.news.dateQuery, 1, function(err, result){
		console.log(result);
	});

//	that.crawler.queue.add('http','app.chosun.com',80,'/site/data/html_dir/2015/09/16/2015091601824.html', 2);


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
	else if(that.config.daum.pattern.test(str)){
		console.log('-----------------daum');
		return {
			parser : require('./parser/'+that.config.daum.name+'/'+that.config.daum.name)(str, that.config.daum),
			domain : that.config.daum
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
		return null;
	}
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
			var domain = that._selectDomain(queueItem.url);
			if(!domain)
				return;
			//console.log(domain);
			parser = domain.parser;
			if(!parser)
				return;
			parser.init(responseBuffer);
			var data = parser.parseURL();
		    console.log(data);
		    data.forEach(function(val){
		    	
		    	var parsedURL = urlParser.parse(val.link);
		    	//console.log(parsedURL);
				that.crawler.queue.add('http',parsedURL.host,80,parsedURL.path,2, function(err, result){
					if(err)
						console.log(err);
				});
				
		    });

		    var arrPage = parser.getNextPage();
		    arrPage.forEach(function(link){
		    	//console.log(link);
		    	var parsedURL = urlParser.parse(link);
		    	//console.log(parsedURL);
				that.crawler.queue.add(parsedURL.protocol,parsedURL.host,80,parsedURL.path, 1, function(err, result){
					if(err)
						console.log(err);
				});
		    });
		}
		else{
			var domain = that._selectDomain(queueItem.url);
			if(!domain)
				return;
			parser = domain.parser;
			if(!parser || !parser.init(responseBuffer))
				return;
			var title = parser.parseTitle(),
				article = parser.parseArticle(),
				author = parser.parseAuthor(),
				written_ts = parser.parseWrittenTime(),
				modified_ts = parser.parseModifiedTime(),
				category = parser.parseCategory(),
				image = parser.parseImage(),
				sns = parser.parseShare(),
				paper = parser.parsePaper(),
				reg_ts = dateHelper.format('yyyy-MM-dd hh:mm:ss', new Date());

			if(written_ts)
				written_ts = dateHelper.format('yyyy-MM-dd hh:mm:ss',written_ts);
			else
				written_ts = '0000-00-00 00:00:00';
			if(modified_ts)
				modified_ts = dateHelper.format('yyyy-MM-dd hh:mm:ss',modified_ts);
			else
				modified_ts = '0000-00-00 00:00:00';
			/*console.log(article);
			console.log('------------------parsed--------------------');
			console.log(title);
			console.log(author);
			if(written_ts)
				console.log(dateHelper.format('yyyy-MM-dd hh:mm:ss', written_ts));
			if(modified_ts)
				console.log(dateHelper.format('yyyy-MM-dd hh:mm:ss', modified_ts));
			console.log('category: ' + category);
			console.log(image);
			console.log(sns);
			console.log('-------------------------------------------');*/

			var q_insert_table = "insert into chosun(date,keyword,url,title,article,author,written_ts,modified_ts,category,image,paper,share,reg_ts)";
				q_insert_value = " values(\'%s\',\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\'%s\',\'%s\',\"%s\",\"%s\",%s,%s,\'%s\')";
			q_insert = sprintf(q_insert_table + q_insert_value, reg_ts,that.keyword['raw'],mysql.escape(queueItem.url),mysql.escape(title),mysql.escape(article) , mysql.escape(author),written_ts,modified_ts,mysql.escape(category),mysql.escape(image),paper,sns,reg_ts);
			console.log(q_insert);
			that.conn.query(q_insert,function(err, result){
				if(err){
					console.log(err);
					throw new Error('sql error');
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

	that.crawler.on("fetchredirect", function(queueItem, parsedURL, response){
		that.crawler.queue.add(parsedURL.protocol,parsedURL.host,80,parsedURL.path,2, function(err, result){
			if(err)
				console.log(err);
			else{
				//console.log('--------------------queue added------------------------');
				//console.log(result);
				//console.log('-------------------------------------------------------');
			}
		}); 
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






