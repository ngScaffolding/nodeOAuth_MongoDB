import * as fs from 'fs';
import { join } from 'path';
import { ConnectionOptions } from 'mongoose';

import { IOAuthTokensModel, OAuthTokensModel } from './tokens.model';
import { IOAuthUsersModel, OAuthUserModel } from './users.model';
import { IOAuthClientModel, OAuthClientModel } from './clients.model';

require('dotenv').config();
const mongoose = require('mongoose');

export class Database {
    private static _database: Database;

    private constructor() {
        mongoose.Promise = global.Promise;

        let options: ConnectionOptions = <ConnectionOptions>{
            promiseLibrary: global.Promise
        };

        if (process.env.DB_PASS) {
            console.debug(`Setting process.env.DB_USER: ${process.env.DB_USER}`);
            options.user = process.env.DB_USER;
        }
        if (process.env.DB_PASS) {
            console.debug(`Setting process.env.DB_PASS`);
            options.pass = process.env.DB_PASS;
        }

        mongoose
            .connect(
                process.env.DB_HOST,
                options
            )
            .catch((err: Error) => {
                console.error(err, `Error connecting to Mongodb`);
            });

        // When successfully connected
        mongoose.connection.on('connected', () => {
            console.info('Mongoose default connection open to ', process.env.DB_HOST);
        });

        // If the connection throws an error
        mongoose.connection.on('error', err => {
            console.error(err, 'Mongoose default connection error: ');
        });

        // When the connection is disconnected
        mongoose.connection.on('disconnected', () => {
            console.error('Mongoose default connection disconnected');
        });

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                console.info('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });
    }

    static get instance() {
        if (!Database._database) {
            Database._database = new Database();
        }
        return Database._database;
    }

    initialise(): boolean {
        console.info('Connecting to Database');
        return typeof Database.instance != 'undefined';
    }

    // //////////////////////////////////////////////////////////////////
    //
    // Client Section
    // 
    // //////////////////////////////////////////////////////////////////
   
    public async getClientFromID(clientId: string, clientSecret: string = null): Promise<IOAuthClientModel> {
        if(clientSecret){
            return await OAuthClientModel.findOne({ clientId: clientId, clientSecret: clientSecret });
        } else
        {
            return await OAuthClientModel.findOne({ clientId: clientId });
        }
    }

    // //////////////////////////////////////////////////////////////////
    //
    // User Section
    // 
    // //////////////////////////////////////////////////////////////////
   
    public async getUserFromID(userId: string, password: string = null): Promise<IOAuthUsersModel> {
        
        return await OAuthUserModel.findOne({userId: userId});
    }
}

export const DB = Database.instance;
