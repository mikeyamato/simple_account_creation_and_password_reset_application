// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');

import { MongoClient } from 'mongodb';
import _ from 'lodash';

import { IMongoListDatabases, IUserData } from '../types/DatabaseTypes';
import logger from '../logger';

export async function initDB(){
	
	// // Connection URL
	// const mongoUrl: string = String(process.env.MONGO_URI);
	// const client: MongoClient = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
	const client = await dbConnection();
	
	// Database Name
	// const dbName = 'testDB';

	// URL with DB name
	// const completeUrl = mongoUrl.concat('/', dbName);

	// console.log(completeUrl)

	// const client: MongoClient = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
	// console.log('client:', client)

	try {
		// await client.connect();
		logger.info('connected to database.')
		await listDatabases(client);
	} catch (err) {
		console.log(err)
	} finally {
		await client.close();
	}
	
	// // Use connect method to connect to the server
	// MongoClient.connect(completeUrl, {useUnifiedTopology: true}, (err, client) => {
	// 	if (err) {
	// 		throw err;
	// 	}
	// 	assert.equal(null, err);
	// 	console.log("DB successfully created");
		
	// 	// const db = client.db(dbName);
	// 	// console.log('**** db: ',db)
	// 	client.close();
	// });

}

async function dbConnection(){
	// Connection URL
	const mongoUrl: string = String(process.env.MONGO_URI);
	const client: MongoClient = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
	return await client.connect();
}

async function listDatabases(client: MongoClient){
	const databases = await client.db().admin().listDatabases();

	console.log('Databases:');
	databases.databases.forEach((db:IMongoListDatabases) => console.log(` - ${db.name}`));
};

export async function insertDocs(newDoc: any, database: string){

	const client = await dbConnection();
	// Database Name

	const db = client.db(database);

	// Get the documents collection
	const collection = db.collection('documents');
	// Insert some documents
	return collection.insertMany([
		newDoc
	], (err, result) => {
		// assert.equal(err, null);
		// assert.equal(3, result.result.n);
		// assert.equal(3, result.ops.length);
		console.log("Document(s) inserted.");
		client.close();
		return result;
	});
}

export async function findUser(emailAddress: string): Promise<IUserData> {

	const client = await dbConnection();
	const dbName = 'users';
	const db = client.db(dbName);

	// Get the documents collection
	const collection = db.collection('documents');
	// Find some documents

	// collection.findOne({email: emailAddress}, (error, result) => {
	// 	// assert.equal(err, null);
	// 	// console.log("Found the following records");
	// 	client.close();
	// 	// console.log('result',result)
	// 	logger.info(`Following result found: ${JSON.stringify(result)}`)
	// 	if(_.isEmpty(result)) {
	// 		logger.info('No matching user.')
	// 		// return false;
	// 	} else {
	// 		logger.info('Matching user found.')
	// 		bool = true;
	// 	}
	// });

	return await collection.findOne({email: emailAddress}) as IUserData;
	
}

export async function updateUser(user: IUserData) {

	const client = await dbConnection();
	const dbName = 'users';
	const db = client.db(dbName);

	// Get the documents collection
	const collection = db.collection('documents');
	// Update document
	return collection.updateOne({ email : user.email }, { $set: { resetPasswordToken : user.resetPasswordToken, resetPasswordExpires: user.resetPasswordExpires, password: user.password } });
}

export async function findUserByResetToken(resetToken: string): Promise<IUserData> {
	const client = await dbConnection();
	const dbName = 'users';
	const db = client.db(dbName);

	// Get the documents collection
	const collection = db.collection('documents');
	// Find some documents
	return await collection.findOne({resetPasswordToken: resetToken}) as IUserData;
}

export async function upsert<T>(getTable: any, doc: T) {
  try {
    const table = getTable();
    return await table.insert(doc);
  } catch (error) {
    logger.error("Error upsert doc:", { error });
    throw error;
  }
}

export function getUsersTable() {
  return;
}

