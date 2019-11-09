export function validateEmail(email: string) {
  const regx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regx.test(email.toLowerCase());
}
​
export function validatePassword(password: string) {
  // pass should be more than 8 characters, contain upper and lower case letters, and either a number or symbol
  const regx = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})(?=.*[!@#$%^&*])');
  return regx.test(password);
}