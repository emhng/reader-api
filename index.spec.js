const index = require('./index');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/', index);

test('index route returns correct json', done => {
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
