import { Document, Schema } from 'mongoose';

const mongoose = require('mongoose');

export interface IOAuthUsersModel extends Document {
    email: string,
    firstname: string,
    lastname: string,
    password: string,
    username: string,
    roles: string[]
}

const OAuthUsersSchema = new Schema({
    email: { type: String, default: '' },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    username: { type: String },
    roles: [String]
  });

  export let OAuthUsersModel = mongoose.model('OAuthUsersSchema', OAuthUsersSchema);