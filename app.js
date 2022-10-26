const PORT = 8000;

const cors = require('cors');
const rateLimit = require('express-rate-limit');

const express = require('express');

const app = express();
app.set('trust proxy', 1);
app.use(cors());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 50,
	standardHeaders: true,
	message: 'Too many requests, try again in 15 minutes'
});

app.use(limiter);

const indexRouter = require('./index');
app.use('/', indexRouter);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
