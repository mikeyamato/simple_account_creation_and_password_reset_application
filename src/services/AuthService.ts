import bcrypt from 'bcrypt';
import { IUserData } from '../types/DatabaseTypes';
import { insertDocs } from './DBService';
​
export async function createUser(firstName: string, lastName: string, email: string, password: string) {
  const hashedPassword: string = await encryptPassword(password);
  const newUser: IUserData = {
		firstName,
		lastName,
    email,
    password: hashedPassword,
  };
  const dbName = 'users';
  return await insertDocs(newUser, dbName);
}
​
export async function encryptPassword(password: string) {
  return await bcrypt.hash(password, 12);
}

export async function checkPassword(enteredPassword: string, savedPassword: string) {
  return await bcrypt.compare(enteredPassword, savedPassword);
}

​