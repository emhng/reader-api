var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.json({
		status: 200,
		message: 'REST API for getting posts of 2ch.sc doujin forum threads'
	});
});

module.exports = router;
