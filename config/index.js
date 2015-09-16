'use strict';

var path = require('path'),
	dateHelper = require('./dateHelper')();

module.exports = function(d) {
	var startDate = new Date(d),
		endDate = new Date(d);

	startDate.setHours(0);
	startDate.setMinutes(0);
	return {
		naver: {
			url: 'news.search.naver.com',
			host: 'news.search.naver.com',
			encoding: 'utf-8',
			parser: 'naver',
			initialPath: '/search.naver?where=news&se=0&ie=utf8&sm=tab_jir&sort=0&photo=0&field=0&reporter_article=&pd=4&docid=&nso=so%3Ar%2Cp%3A1d%2Ca%3Aall&mynews=1&mson=1&refresh_start=0&related=0&query=',
			dateQuery : '&ds=' + dateHelper.format('yyyy.MM.dd.HH.mm', startDate) + '&de=' + dateHelper.format('yyyy.MM.dd.HH.mm', endDate),
			cookie: 'NNB=4A6MAFW5IQRFK; npic=R1Q7Q7C/byNaEVVIVAjntLErZipRF6zmt7D9sYZhfwKoYp1u7dHQNOFH51HdjyCxCA==; _ga=GA1.2.1803039101.1442198164; nid_iplevel=1; nid_inf=1867266447; NID_AUT=Nga0/B46hKuraOx9aX/9SxkTD4TQ9J7l11tO7B6Hm2Nssu2eWZTBFJU3kn8HPMyb; NIPD=1; page_uid=SQi9AwpySD0ssskrx70ssssssu8-522319; _naver_usersession_=xWRZvHhTiQ0z4I+Lu1R6aA==; nx_open_so=1; news_my_status=1; news_office_checked=1023; news_office_fold=; NID_SES=AAABW7mzLziZmI5FFZWmXocHX7eqMmt0f2+Ud4562zDWqp2lMchKxBjvPqH8RmR3wlPuE2Z1mDyf9oz7KpM3CZrRLxsjYPb6h/5PsgFGffugkNF8knuvjU78SyJ42Pla/1qFQNbO42QdNjCtBteWuSuht43qLt9sV9/+2oCdWjQlrylBHpJvrdZBg10RmCVWo1ZAg77FuKd8YWaDChOzKwHRFybBUBlToBHA8ii/rH6xPw2QXzpulCU4k3B2RuXWHrREXa2hPg4A2t5mvjVENj72HGn9whWrtfe89DDWzXjuKydfsolpKf4KYzmJruOg97MccDAMWwl8nvkpCdZqgeXjS8IJjI8ZwU73+8c4+V1qscawbK4esfJfoprFwCY7aGc8l9hoov3S1lIpGT0iez1Y7YIpSqXnUmNevwa4Cusg1vKFsbsoEZPlh1zul7bE9rcGE3Sp+AguQotkdSeloWZSyTs=; nx_msp=news%5Enews%5Esort%26photo%26field%26reporter_article%26pd%26ds%26de%26mynews%26refresh_start%26related; nx_msv=sort%3A0%26photo%3A0%26field%3A0%26pd%3A4%26ds%3A2015.09.13.16.55%26de%3A2015.09.15.16.55%26mynews%3A1%26refresh_start%3A0%26related%3A0%26reporter_article%3A'
		},
		chosun: {
			url: 'console.log(dom);',
			host: 'console.log(dom);',
			encoding: 'euc-kr',
			parser: 'chosun',
			initialPath: '/search.naver?where=news&se=0&ie=utf8&sm=tab_jir&sort=0&photo=0&field=0&reporter_article=&pd=4&docid=&nso=so%3Ar%2Cp%3A1d%2Ca%3Aall&mynews=1&mson=1&refresh_start=0&related=0&query=',
			dateQuery : '&ds=' + dateHelper.format('yyyy.MM.dd.HH.mm', startDate) + '&de=' + dateHelper.format('yyyy.MM.dd.HH.mm', endDate),
			cookie: 'NNB=4A6MAFW5IQRFK; npic=R1Q7Q7C/byNaEVVIVAjntLErZipRF6zmt7D9sYZhfwKoYp1u7dHQNOFH51HdjyCxCA==; _ga=GA1.2.1803039101.1442198164; nid_iplevel=1; nid_inf=1867266447; NID_AUT=Nga0/B46hKuraOx9aX/9SxkTD4TQ9J7l11tO7B6Hm2Nssu2eWZTBFJU3kn8HPMyb; NIPD=1; page_uid=SQi9AwpySD0ssskrx70ssssssu8-522319; _naver_usersession_=xWRZvHhTiQ0z4I+Lu1R6aA==; nx_open_so=1; news_my_status=1; news_office_checked=1023; news_office_fold=; NID_SES=AAABW7mzLziZmI5FFZWmXocHX7eqMmt0f2+Ud4562zDWqp2lMchKxBjvPqH8RmR3wlPuE2Z1mDyf9oz7KpM3CZrRLxsjYPb6h/5PsgFGffugkNF8knuvjU78SyJ42Pla/1qFQNbO42QdNjCtBteWuSuht43qLt9sV9/+2oCdWjQlrylBHpJvrdZBg10RmCVWo1ZAg77FuKd8YWaDChOzKwHRFybBUBlToBHA8ii/rH6xPw2QXzpulCU4k3B2RuXWHrREXa2hPg4A2t5mvjVENj72HGn9whWrtfe89DDWzXjuKydfsolpKf4KYzmJruOg97MccDAMWwl8nvkpCdZqgeXjS8IJjI8ZwU73+8c4+V1qscawbK4esfJfoprFwCY7aGc8l9hoov3S1lIpGT0iez1Y7YIpSqXnUmNevwa4Cusg1vKFsbsoEZPlh1zul7bE9rcGE3Sp+AguQotkdSeloWZSyTs=; nx_msp=news%5Enews%5Esort%26photo%26field%26reporter_article%26pd%26ds%26de%26mynews%26refresh_start%26related; nx_msv=sort%3A0%26photo%3A0%26field%3A0%26pd%3A4%26ds%3A2015.09.13.16.55%26de%3A2015.09.15.16.55%26mynews%3A1%26refresh_start%3A0%26related%3A0%26reporter_article%3A'
		}
	};
};
