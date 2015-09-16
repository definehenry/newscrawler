var Crawler = require("simplecrawler");
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var encoding = 'utf-8';
var urlModule = require('url');
var customeCrawler = require('./CustomCrawler');
var chosunConfig = require('./config/chosun');

var myCrawler = customeCrawler(chosunConfig(new Date()),'정부');


myCrawler.startFromSeeds();

