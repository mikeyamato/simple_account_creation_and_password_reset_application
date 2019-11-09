import { Request, Response } from 'express';
import express from 'express';
import { IUserData } from '../types/DatabaseTypes';
import { findUser, findUserByResetToken, updateUser } from '../services/DBService';
import jwt from 'jsonwebtoken';
import { createUser, checkPassword, encryptPassword } from '../services/AuthService';
import crypto from 'crypto';
import _ from 'lodash';
import { validateEmail, validatePassword } from '../util/validator';
import { sendResetPasswordEmail } from '../services/EmailService';
import logger from '../logger';
​
export const router = express.Router();
const passwordErrorMessage: string = 'The password you entered is incorrect. Try again.';
const emailErrorMessage: string = 'The email you entered is incorrect. Try again.';
const firstNameErrorMessage: string = 'The first name you entered is incorrect. Try again.';
const lastNameErrorMessage: string = 'The last name you entered is incorrect. Try again.';
const loginErrorMessage: string = 'The email or password entered is incorrect. Try again.';
const tokenErrorMessage: string = 'The URL entered is incorrect. Try again.';

const weakPasswordErrorMessage: string =
  'Weak password:\n' +
  '• Must be a minimum of 8 characters\n' +
  '• Use both upper and lower case characters\n' +
  '• Use one or more numbers\n' +
  '• Use one or more of these special characters ! @ # $ % ^ & *';
​
router.post('/signup', async (req: Request, res: Response) => {
  console.log('this hits')
  logger.info(req.body)

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  if (_.isEmpty(firstName)) {
    return res.status(400).json({ message: firstNameErrorMessage });
  }
  if (_.isEmpty(lastName)) {
    return res.status(400).json({ message: lastNameErrorMessage });
  }
  if (_.isEmpty(email)) {
    return res.status(400).json({ message: emailErrorMessage });
  }
  if (_.isEmpty(password)) {
    return res.status(400).json({ message: passwordErrorMessage });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: emailErrorMessage });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({
      message: weakPasswordErrorMessage
    });
  }
  if (password !== req.body.confirmedPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }
  // see if user exists already
  const userData: IUserData = await findUser(email);
	let userDataAvailable: boolean = false;
	if(_.isEmpty(userData)) {
		logger.info('No matching user.')
	} else {
		logger.info('Matching user found.')
		userDataAvailable = true;
	}
  if (userDataAvailable) {
    return res.status(400).json({ message: 'User already exists.' });
  } else {
    try {
      await createUser(firstName, lastName, email, password);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Unable to create user.' });
    }
    return res.status(200).json({ message: 'User has been created.' });
  }
});
​
router.post('/login', async (req: Request, res: Response, next: any) => {
  // validate request
  if (_.isEmpty(req.body.email)) {
    return res.status(400).json({ message: emailErrorMessage });
  }
  if (_.isEmpty(req.body.password)) {
    return res.status(401).json({ message: passwordErrorMessage });
  }
  if (!validateEmail(req.body.email)) {
    return res.status(401).json({ message: emailErrorMessage });
  }
  try {
    const email: string = req.body.email;
    const user: IUserData = await findUser(email);
    if (!user) {
      return res.status(401).json({ message: loginErrorMessage });
    } else {
      const matched: boolean = await checkPassword(req.body.password, user.password);
      if (matched !== true) {
        return res.status(401).json({ message: loginErrorMessage });
      }
      const accessToken = jwt.sign({ id: email }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRATION_IN_HOURS + ' hours'
      });
      console.log('accessToken', accessToken)
      return res
        .status(200)
        .cookie('auth', accessToken, {
          signed: true,
          expires: new Date(Date.now() + Number(process.env.JWT_EXPIRATION_IN_HOURS) * 60 * 60 * 1000)
        })
        .json({
          auth: true,
          message: 'Authorized'
        });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to create user.' });
  }
});
​
router.get('/logout', async (req: Request, res: Response, next: any) => {
  return res
    .status(200)
    .clearCookie('auth')
    .json({
      auth: false,
      message: 'Logged out'
    });
});

router.post('/forgotpassword', async (req: Request, res: Response) => {
  if (_.isEmpty(req.body.email)) {
    return res.status(400).send({ message: emailErrorMessage });
  }
  const email: string = req.body.email;
  const user: IUserData | undefined = await findUser(email);
  if (_.isEmpty(user)) {
    // provide ambiguous response
    return res.status(200).json({ message: 'If you have an account, we’ll email you a reset link.' });
  } else {
    const token = crypto.randomBytes(20).toString('hex');
    try {
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + Number(process.env.PASSWORD_RESET_LINK_EXPIRATION_IN_HOURS) * 60 * 60 * 1000;
      await updateUser(user);
      logger.info('user information updated.')
    } catch (err) {
      logger.error('Unable to update user with reset password token.', err);
      return res.status(500).json({ message: 'Unable to send reset password link.' });
    }
    try {
      await sendResetPasswordEmail(email, token);
      logger.info('reset password email sent.')
    } catch (err) {
      logger.error('Error sending email ', err);
      return res.status(500).json({ message: 'Unable to send email.' });
    }
    return res.status(200).json({ message: 'If you have an account, we’ll email you a reset link.' });
  }
});
​
router.post('/resetpassword', async (req: Request, res: Response) => {
  const token = req.body.token;
  
  if (_.isEmpty(token)) {
    return res.status(400).json({ message: tokenErrorMessage });
  }
  const user: IUserData = await findUserByResetToken(token);
  if (!user) {
    return res.status(400).json({ message: tokenErrorMessage });
  } else {
    if (new Date().getTime() > user.resetPasswordExpires!) {
      return res.status(403).send({ message: 'Password reset link has expired.' });
    }
    if (_.isEmpty(req.body.password)) {
      return res.status(400).json({ message: passwordErrorMessage });
    }
    if (req.body.password !== req.body.confirmedPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
    if (await checkPassword(req.body.password, user.password)) {
      return res.status(400).json({ message: 'The password can not be the same as the previous one.' });
    }
    if (!validatePassword(req.body.password)) {
      return res.status(400).json({
        message: weakPasswordErrorMessage
      });
    }
    const hashedNewPassword = await encryptPassword(req.body.password);
​
    try {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = 0;
      user.password = hashedNewPassword;
      await updateUser(user);
    } catch (err) {
      console.error('Unable to reset password', err);
      return res.status(500).json({ message: 'Unable to reset password.' });
    }
​
    const accessToken = jwt.sign({ id: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRATION_IN_HOURS + ' hours'
    });
​
    return res
      .status(200)
      .cookie('auth', accessToken, {
        signed: true,
        expires: new Date(Date.now() + Number(process.env.JWT_EXPIRATION_IN_HOURS) * 60 * 60 * 1000)
      })
      .send({
        email: user.email,
        message: 'Password reset success.'
      });
  }
});
​
