import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { initDB } from './services/DBService';
import logger from './logger';
import { initTransportEmail } from './services/EmailService';

import { router } from './routes';

const app = express();

dotenv.config();
app.use(cors({ credentials: true, origin: process.env.FRONT_END_SITE_URL }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api/', router);
app.use(passport.initialize());
initTransportEmail();

const run = async () => {
	const PORT = 5000;
	await initDB();
	app.listen(PORT, err => {
		if (err) {
			logger.error(err);
		}
		logger.info(`server is listening on ${PORT}`);
	});
}

run();
