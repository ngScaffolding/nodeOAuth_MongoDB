import { Document, Schema } from 'mongoose';
import { BasicUser } from '@ngscaffolding/models';

const mongoose = require('mongoose');

export interface IOAuthUsersModel extends BasicUser, Document {
    salt: string;
    password: string;
    expires: Date;
    passwordFailures: number;
    passwordLastFailed: number;
    changeNextLogon: boolean;
}

const OAuthUserSchema = new Schema({
    userId: String,
    email: { type: String, default: '' },
    name: { type: String },
    firstname: { type: String },
    lastname: { type: String },
     
    roles: [String],

    password: { type: String },
    salt: String,
    expires: Date,
    passwordFailures: Number,
    passwordLastFailed: Number,
    changeNextLogon: Boolean
  });

  export let OAuthUserModel = mongoose.model('OAuthUser', OAuthUserSchema);