import { Request, Response } from 'express';
import express from 'express';

import logger from '../logger';
import { loggedIn } from '../middleware/auth';

export const router = express.Router();

router.get('/landing', loggedIn, async (req: Request, res: Response) => {
	logger.info('main page hit.');
	return res.status(200).json({ message: "You've reached the main section." });
});
