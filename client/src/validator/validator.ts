export const EMAIL_ERROR_MESSAGE: string = 'Your email is invalid. Enter a correct email address.';

export const PASSWORD_ERROR_MESSAGE: string = 'Your password is invalid. Enter a correct password.';

export const NAME_ERROR_MESSAGE: string = 'First name and last name is required.';

export const WEAK_PASSWORD_ERROR_MESSAGE: string =
  'Weak password:\n' +
  '• Use at least 8 characters\n' +
  '• Use both upper and lower case characters\n' +
  '• Use one or more numbers\n' +
  '• Use one or more of these special characters ! @ # $ % ^ & *';

export const PASSWORD_REGX = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})(?=.*[!@#$%^&*])');

// regex from https://emailregex.com/
// eslint-disable-next-line
export const EMAIL_REGX = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
