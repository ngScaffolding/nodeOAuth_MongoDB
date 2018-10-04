import * as fs from 'fs';
import { join } from 'path';
import { ConnectionOptions } from 'mongoose';

import { IOAuthTokensModel, OAuthTokensModel } from './models/tokens.model';
import { IOAuthUsersModel, OAuthUserModel } from './models/users.model';
import { IOAuthClientModel, OAuthClientModel } from './models/clients.model';

import { IClientDataAccess, IUserDataAccess } from '../dataAccessLayer';

require('dotenv').config();
var winston = require('../../config/winston');

const mongoose = require('mongoose');

export class Database implements IClientDataAccess, IUserDataAccess {
    private static _database: Database;

    private constructor() {
        mongoose.Promise = global.Promise;

        let options: ConnectionOptions = <ConnectionOptions>{
            promiseLibrary: global.Promise
        };

        if (process.env.DB_PASS) {
            winston.info(`Setting process.env.DB_USER: ${process.env.DB_USER}`);
            options.user = process.env.DB_USER;
        }
        if (process.env.DB_PASS) {
            winston.info(`Setting process.env.DB_PASS`);
            options.pass = process.env.DB_PASS;
        }

        if(process.env.DB_HOST) {
            mongoose.connect(process.env.DB_HOST,options)
                .catch((err: Error) => {
                    winston.error(err, `Error connecting to Mongodb`);
                });
        }

        // When successfully connected
        mongoose.connection.on('connected', () => {
            winston.info('Mongoose default connection open to ', process.env.DB_HOST);
        });

        // If the connection throws an error
        mongoose.connection.on('error', err => {
            winston.error(err, 'Mongoose default connection error: ');
        });

        // When the connection is disconnected
        mongoose.connection.on('disconnected', () => {
            winston.error('Mongoose default connection disconnected');
        });

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                winston.info('Mongoose default connection disconnected through app termination');
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
        winston.info('Connecting to Database');
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

    // Fire and forget
    public async userLoggedOn(userId: string) {
        
        // Reset passwordFailures
        // Reset passwordLastFailed

        OAuthUserModel.findOneAndUpdate({userId: userId},
             {passwordFailures: 0, passwordLastFailed: null },{},(error,doc) => {
        });
    }

    // Fire and forget
    public async userLogonFailed(userId: string) {
        // Increment passwordFailures
        // Set passwordLastFailed
        
        let user = OAuthUserModel.findOne({userId: userId})
        if(!user.passwordFailures){ user.passwordFailures = 0; }

        let update = {
            passwordFailures: user.passwordFailures + 1,
            passwordLastFailed: new Date()
        };

        OAuthUserModel.findOneAndUpdate(user, update,{},(error,doc) => {
       });
    }
}

export const DB = Database.instance;
