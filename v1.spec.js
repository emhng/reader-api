const api = require('./v1');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/', api);

test('Index route returns correct json', done => {
	request(app)
		.get('/')
		.expect('Content-Type', /json/)
		.expect({
			status: 200,
			message: 'REST API for getting posts of 2ch.sc doujin forum threads'
		})
		.expect(200, done);
});

test('Returns 404 if thread not found', done => {
	request(app)
		.get('/123456')
		.expect('Content-Type', /json/)
		.expect(404, done);
});

test('Returns last 50 posts for a thread', done => {
	request(app)
		.get('/1658502889/last50')
		.expect('Content-Type', /json/)
		.expect(200, done);
});

test('Returns all posts for a thread', done => {
	request(app)
		.get('/1658502889')
		.expect('Content-Type', /json/)
		.expect(200, done);
});

test('Returns newest posts for a thread', done => {
	request(app)
		.get('/1658502889/new/1001')
		.expect('Content-Type', /json/)
		.expect({
			id: '1658502889',
			title: 'マイナージャンル・カプ・キャラを語るスレ68',
			totalCount: '1001',
			posts: [
				{
					postId: '1001',
					name: '2ch.net投稿限界',
					message: '2ch.netからのレス数が1000に到達しました。'
				}
			]
		})
		.expect(200, done);
});
