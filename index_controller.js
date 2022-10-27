const axios = require('axios');
const iconv = require('iconv-lite');

const cheerio = require('cheerio');

const baseUrl = 'https://nozomi.2ch.sc/test/read.cgi/doujin/';

const createJson = (response, res) => {
	const html = iconv.decode(response.data, 'Shift_JIS');
	const $ = cheerio.load(html);

	const title = $('h1', html).text();
	const thread = $('dl.thread', html);
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

	res.json({ title, totalCount, posts });
};

module.exports.posts_get_all = function (req, res) {
	axios(baseUrl + req.params.threadId, { responseType: 'arraybuffer' })
		.then(response => {
			createJson(response, res);
		})
		.catch(err => {
			res.status(err.response.status);
			res.json(err);
		});
};

module.exports.posts_get_l50 = function (req, res) {
	axios(baseUrl + req.params.threadId + '/l50', { responseType: 'arraybuffer' })
		.then(response => createJson(response, res))
		.catch(err => {
			res.status(err.response.status);
			res.json(err);
		});
};
