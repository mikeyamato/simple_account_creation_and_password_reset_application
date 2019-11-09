import express, { Request, Response } from 'express';

import { router as authRouter } from './auth';
import { router as mainRouter } from './main';

export const router = express.Router();

router.use('/auth', authRouter); 
router.use('/main', mainRouter); 

router.all('*', (req: Request, res: Response) => {
	res.status(404).send({msg: 'not found'});
})