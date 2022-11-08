var express = require('express');
var router = express.Router();

const api_controller = require('./api_controller_v1');

router.get('/', function (req, res) {
	res.json({
		status: 200,
		message: 'REST API for getting posts of 2ch.sc doujin forum threads'
	});
});

router.get('/:threadId', api_controller.posts_get_all);

router.get('/:threadId/last50', api_controller.posts_get_l50);

router.get('/:threadId/new/:postId', api_controller.posts_get_new);

module.exports = router;
