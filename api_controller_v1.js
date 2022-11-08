const axios = require('axios');
const iconv = require('iconv-lite');

const cheerio = require('cheerio');

const validator = require('express-validator');

const baseUrl = 'https://nozomi.2ch.sc/test/read.cgi/doujin/';

const createJson = (id, response, res) => {
	const html = iconv.decode(response.data, 'Shift_JIS');
	const $ = cheerio.load(html);

	const title = $('h1', html).text();
	const thread = $('dl.thread', html);
	let lastUpdate;
	const posts = [];

	const count = thread.children('dt').length;

	for (let i = 0; i < count; i++) {
		const headerSelector = thread.children('dt')[i];
		const header = $(headerSelector).text();
		const headerArray = header.split(' ');

		const postId = headerArray[0];
		const name = headerArray[1].split('：')[1];
		let date = headerArray[1].split('：')[2];
		let time = headerArray[2];
		let userId = headerArray[3];

		if (userId === '' && headerArray.length === 5) {
			userId = headerArray[4];
		}

		if (date === '[ここ壊れてます]' || name === '2ch.net投稿限界') {
			date = undefined;
			time = undefined;
			userId = undefined;
		}

		if (i === count - 1) {
			if (date && time) {
				const updateDate = date.split('(')[0];
				const slashRegex = /\//g;
				const hyphenDate = updateDate.replace(slashRegex, '-');
				const updateTime = time;
				lastUpdate = hyphenDate + 'T' + updateTime;
			} else {
				lastUpdate = undefined;
			}
		}

		const messageSelector = thread.children('dd')[i];
		const rawMessage = $(messageSelector)
			.text()
			.trim();

		//Format line breaks and returns correctly for message
		const spaceRegex = /\s/g;
		const placeholderMessage = rawMessage.replace(spaceRegex, '<br/>');

		const carriageReturnRegex = /\<br\/\>\<br\/\>\<br\/\>/g;
		const CRMessage = placeholderMessage.replace(carriageReturnRegex, '\n\n');

		const linebreakRegex = /\<br\/\>\<br\/\>/g;
		const LBMessage = CRMessage.replace(linebreakRegex, '\n');

		const singleSpaceRegex = /\<br\/\>/g;
		const message = LBMessage.replace(singleSpaceRegex, ' ');

		posts.push({ postId, name, date, time, userId, message });
	}

	const totalCount = posts[posts.length - 1].postId;

	res.json({ id, title, totalCount, lastUpdate, posts });
};

module.exports.posts_get_all = [
	validator
		.param('threadId', 'Invalid ID')
		.trim()
		.escape(),

	function (req, res) {
		var errors = validator.validationResult(req);

		if (!errors.isEmpty()) {
			res.json({
				errors: errors.array()
			});
			return;
		}

		axios(baseUrl + req.params.threadId, { responseType: 'arraybuffer' })
			.then(response => {
				createJson(req.params.threadId, response, res);
			})
			.catch(err => {
				if (err.response) {
					res.status(err.response.status);
				}
				res.json(err);
			});
	}
];

module.exports.posts_get_l50 = [
	validator
		.param('threadId', 'Invalid ID')
		.trim()
		.escape(),

	function (req, res) {
		var errors = validator.validationResult(req);

		if (!errors.isEmpty()) {
			res.json({
				errors: errors.array()
			});
			return;
		}

		axios(baseUrl + req.params.threadId + '/l50', {
			responseType: 'arraybuffer'
		})
			.then(response => createJson(req.params.threadId, response, res))
			.catch(err => {
				if (err.response) {
					res.status(err.response.status);
				}
				res.json(err);
			});
	}
];

module.exports.posts_get_new = [
	validator
		.param('threadId', 'Invalid ID')
		.trim()
		.escape(),

	validator
		.param('postId', 'Invalid post ID')
		.trim()
		.escape(),

	function (req, res) {
		var errors = validator.validationResult(req);

		if (!errors.isEmpty()) {
			res.json({
				errors: errors.array()
			});
			return;
		}

		axios(baseUrl + req.params.threadId + '/' + req.params.postId + 'n-', {
			responseType: 'arraybuffer'
		})
			.then(response => createJson(req.params.threadId, response, res))
			.catch(err => {
				if (err.response) {
					res.status(err.response.status);
				}
				res.json(err);
			});
	}
];
