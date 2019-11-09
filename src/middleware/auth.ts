import { IUserData } from '../types/DatabaseTypes';
import { findUser } from '../services/DBService';  // find user in DB
import passport from 'passport';
import passportJWT from 'passport-jwt';
import dotenv from 'dotenv';
import logger from '../logger';

dotenv.config();

const JWTstrategy = passportJWT.Strategy;

export const loggedIn = passport.authenticate('jwt', { session: false });
const authCookie: string = 'auth';

const cookieExtractor = (req: any) => {
  let token = null;
  if (req && req.signedCookies) {
    token = req.signedCookies[authCookie];
  }
  return token;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET as string
};

passport.use(
  'jwt',
  new JWTstrategy(opts, async (jwtPayload: any, done: any) => {
    console.log('jwtPayload: ', jwtPayload)
    try {
      const user: IUserData | undefined = await findUser(jwtPayload.id);
      console.log('user', user)
      if (user) {
        logger.info('successfully reached the main section.');
        done(null, user);
      } else {
        logger.info('User ' + jwtPayload.id + ' does not exist.');
        done(null, false);
      }
    } catch (err) {
      done(err);
    }
  })
);