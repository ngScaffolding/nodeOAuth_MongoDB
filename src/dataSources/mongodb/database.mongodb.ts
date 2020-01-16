import * as fs from 'fs';
import { join } from 'path';

import { MongoClient, Db } from 'mongodb';

import { IDataAccessLayer } from '../dataAccessLayer';
import { IUserModel, Role, DocumentDBDataSource, IClientModel } from '../../models/index';

require('dotenv').config();
var winston = require('../../config/winston');

const mongoose = require('mongoose');

export class MongoDatabase implements IDataAccessLayer {
    private static _database: MongoDatabase;
    private mongoClient: MongoClient;
    private mongoDb: Db;

    private dbDatabaseName: string;
    private dbUsersTableName: string;
    private dbClientsTableName: string;
    private dbRolesTableName: string;

    constructor() {
        // Only run on mongodb Data Source
        if (process.env.DATA_SOURCE === 'mongodb') {
            this.dbClientsTableName = process.env['DB_AUTH_DATABASE_NAME'] || 'oAuth_db';
            this.dbClientsTableName = process.env['DB_AUTH_CLIENTS_TABLE'] || 'oAuthClients';
            this.dbUsersTableName = process.env['DB_AUTH_USERS_TABLE'] || 'oAuthUsers';
            this.dbRolesTableName = process.env['DB_AUTH_ROLES_TABLE'] || 'oAuthRoles';

            MongoClient.connect(process.env['DB_HOST']).then(
                mongoClient => {
                    this.mongoClient = mongoClient;
                    let mongodb = this.mongoClient.db(this.dbClientsTableName);

                    winston.info('mongoDb default connection open');
                },
                err => {
                    winston.error(err, `Error connecting to Mongodb`);
                }
            );

            // If the Node process ends, close the Mongoose connection
            process.on('SIGINT', () => {
                this.mongoClient.close(() => {
                    winston.info('mongoDb default connection disconnected through app termination');
                    process.exit(0);
                });
            });
        }
    }

    // //////////////////////////////////////////////////////////////////
    //
    // Client Section
    //
    // //////////////////////////////////////////////////////////////////

    public async getClientFromID(clientId: string, clientSecret: string = null): Promise<IClientModel> {
        if (clientSecret) {
            return await this.mongoDb
                .collection(this.dbClientsTableName)
                .findOne({ clientId: clientId, clientSecret: clientSecret });
        } else {
            return await this.mongoDb.collection(this.dbClientsTableName).findOne({ clientId: clientId });
        }
    }

    // //////////////////////////////////////////////////////////////////
    //
    // Role Section
    //
    // //////////////////////////////////////////////////////////////////
    public async getRole(name: string): Promise<Role> {
        return await this.mongoDb.collection(this.dbRolesTableName).findOne({ name: name });
    }
    public async getAllRoles(): Promise<Role[]> {
        return await this.mongoDb
            .collection(this.dbRolesTableName)
            .find({})
            .toArray();
    }

    // //////////////////////////////////////////////////////////////////
    //
    // User Section
    //
    // //////////////////////////////////////////////////////////////////
    public async getUsers(): Promise<IUserModel[]> {
        return await this.mongoDb
            .collection(this.dbClientsTableName)
            .find({})
            .toArray();
        // return new Promise<IUserModel[]>((resolve, reject) => {
        //     var returnVal = [];
        //     OAuthUserModel.find({}, (err, docs) => {
        //         docs.forEach(doc => {
        //             returnVal.push(doc);
        //         });
        //         resolve(returnVal);
        //     });
        // });
    }

    public async getUserFromID(userId: string, password: string = null): Promise<IUserModel> {
        return await this.mongoDb.collection(this.dbClientsTableName).findOne({ userId: userId });
    }

    addUser(user: IUserModel) {
        throw new Error('Method not implemented.');
    }

    updateUser(user: IUserModel) {
        this.mongoDb
            .collection(this.dbClientsTableName)
            .findOneAndUpdate({ userId: user.userId }, user, {}, (error, doc) => {
                var x = 0;
            });
    }

    // Fire and forget
    public async userLoggedOn(userId: string) {
        // Reset passwordFailures
        // Reset passwordLastFailed

        this.mongoDb
            .collection(this.dbClientsTableName)
            .findOneAndUpdate(
                { userId: userId },
                { passwordFailures: 0, passwordLastFailed: null },
                {},
                (error, doc) => {}
            );
    }

    // Fire and forget
    public async userLogonFailed(userId: string) {
        // Increment passwordFailures
        // Set passwordLastFailed

        let user = await this.mongoDb.collection(this.dbClientsTableName).findOne({ userId: userId });
        if (!user.passwordFailures) {
            user.passwordFailures = 0;
        }

        let update = {
            passwordFailures: user.passwordFailures + 1,
            passwordLastFailed: new Date()
        };

        this.mongoDb
        .collection(this.dbClientsTableName).findOneAndUpdate(user, update, {}, (error, doc) => {});
    }
}

