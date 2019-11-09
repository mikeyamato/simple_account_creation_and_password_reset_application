export interface IUserData {
	_id?: number,
	firstName: string,
	lastName: string,
	email: string,
	password: string,
	resetPasswordToken?: string | undefined;
	resetPasswordExpires?: number;
}