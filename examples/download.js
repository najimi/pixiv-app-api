'use strict';
const co = require('co');
const pixivImg = require('pixiv-img');
const Pixiv = require('../');

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const pixiv = new Pixiv(username, password);

const word = '艦これ10000users入り';

const wait = () => new Promise(resolve => setTimeout(() => resolve(), 100));

function * dl(json) {
	for (const x of json.illusts) {
		console.log(x.title);
		const orignalImgUrl = x.meta_single_page.original_image_url;
		if (orignalImgUrl) {
			yield pixivImg(orignalImgUrl);
			yield wait();
		}
	}
}

co(function * () {
	const json = yield pixiv.searchIllust(word);
	yield dl(json);
	while (true) { // eslint-disable-line no-constant-condition
		if (!pixiv.hasNext()) {
			break;
		}
		const json = yield pixiv.next();
		yield dl(json);
	}
	console.log('finish');
}).catch(console.error);
