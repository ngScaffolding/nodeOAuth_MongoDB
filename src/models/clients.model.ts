import { Document, Schema } from 'mongoose';

const mongoose = require('mongoose');

export interface IOAuthClientModel extends Document {
  clientId: string;
  redirectUris?: string[];
  grants: string[];
  accessTokenLifetime?: number;
  refreshTokenLifetime?: number;
  [key: string]: any;
}

const OAuthClientSchema = new Schema({
  clientId: String,
  redirectUris: [String],
  grants: [String],
  accessTokenLifetime: Number,
  refreshTokenLifetime: Number,
  clientSecret: String
});

export let OAuthClientModel = mongoose.model('OAuthClient', OAuthClientSchema);
