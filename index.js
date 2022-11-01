var express = require('express');
var router = express.Router();

const index_controller = require('./index_controller');

router.get('/', function (req, res) {
	res.json({
		status: 200,
		message: 'REST API for getting posts of 2ch.sc doujin forum threads'
	});
});

router.get('/:threadId', index_controller.posts_get_all);

router.get('/:threadId/last50', index_controller.posts_get_l50);

router.get('/:threadId/new/:postId', index_controller.posts_get_new);

module.exports = router;
