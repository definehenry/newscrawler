'use strict';

var path = require('path'),
	dateHelper = require('./dateHelper')();

module.exports = function(d) {
	var startDate = new Date(d),
		endDate = new Date(d);

	return {
		naver: {
			name : 'naver',
			pattern : /news.naver.com/i,
			url: 'news.naver.com',
			host: 'news.naver.com',
			subdomain: [
				'news.naver.com'
			],
			keywordEncoding : 'utf-8',			
			encoding: {
				'news.naver.com': 'euc-kr'
			},
			parser: 'naver',
			path: '/main/search/search.nhn?rcnews=exist%3A023%3A&rcsection=exist%3A&sm=all.basic&pd=4&newscode=023&query=',
			dateQuery : '&startDate=' + dateHelper.format('yyyy-MM-dd', startDate) + '&endDate=' + dateHelper.format('yyyy-MM-dd', endDate),
			headers : {
				'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Accept-Encoding':'deflate, sdch',
				'Accept-Language':'ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4',
//				'Cookie': 'NNB=4A6MAFW5IQRFK; npic=R1Q7Q7C/byNaEVVIVAjntLErZipRF6zmt7D9sYZhfwKoYp1u7dHQNOFH51HdjyCxCA==; _ga=GA1.2.1803039101.1442198164; nid_iplevel=1; nid_inf=1867266447; NIPD=1; page_uid=SQO34soRR1ossc4/Jk4sssssss4-029075; _naver_usersession_=6uzBuZFiiIUgUAxnREDpqg==; nx_msp=news%5Enews%5Esort%26photo%26field%26reporter_article%26pd%26ds%26de%26mynews%26refresh_start%26related; nx_msv=sort%3A0%26photo%3A0%26field%3A0%26pd%3A4%26mynews%3A1%26refresh_start%3A0%26related%3A0%26reporter_article%3A%26ds%3A%26de%3A; nx_open_so=1; news_my_status=1; news_office_checked=1023; news_office_fold=',
//				'Referer': 'http://news.search.naver.com/search.naver?where=news&se=0&ie=utf8&sm=tab_opt&sort=0&photo=0&field=0&reporter_article=&pd=4&ds=&de=&docid=&nso=so%3Ar%2Cp%3A1d%2Ca%3Aall&mynews=1&mson=1&refresh_start=0&related=0&query=',
				'Host': 'news.naver.com',
				'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36'
			}
		},
		daum : {
			name : 'daum',
			pattern : /daum.net/i,
			url : 'search.daum.net',
			host : 'search.daum.net',
			subdomain: [
				'search.daum.net'
			],
			keywordEncoding : 'utf-8',
			encoding: {
				'search.daum.net': 'utf-8'
			},
			parser : 'daum',
			path : '/search?w=news&req=tab&cp=16EeZKAuilXKH5dzIt&cluster=n&viewio=i&repno=0&period=u&n=10&p=1&DA=NNS&q=',
			dateQuery : '&sd=' + dateHelper.format('yyyyMMdd',startDate) + '000000' + '&ed=' + dateHelper.format('yyyyMMddhhmmss',endDate)
		},
		news: {
			name: 'chosun',
			pattern : /chosun.com/i,
			url: 'search.chosun.com',
			host: 'search.chosun.com',
			subdomain: [
				'search.chosun.com','biz.chosun.com', 'news.chosun.com', 'art.chosun.com','danmee.chosun.com','app.chosun.com'
			],
			keywordEncoding : 'utf-8',				
			encoding : {
				'search.chosun.com' : 'utf-8',
				'biz.chosun.com': 'utf-8',
				'danmee.chosun.com' : 'euc-kr',
				'news.chosun.com' : 'euc-kr',
				'art.chosun.com' : 'euc-kr',
				'app.chosun.com' : 'euc-kr'
			},
			parser: 'chosun',
			path: '/search/news.search?pageno=0&orderby=news&naviarraystr=&kind=&cont1=&cont2=&cont5=&categoryname=&categoryd2=&c_scope=&premium=&query=',
			dateQuery : '&sdate=' + dateHelper.format('yyyy.MM.dd', startDate) + '&edate=' + dateHelper.format('yyyy.MM.dd', endDate),
			headers : {
				'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Accept-Encoding':'gzip, deflate, sdch',
				'Accept-Language':'ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4',
				'meta' : 'charset=utf-8',
				'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36'
			}
		}
	};
};
