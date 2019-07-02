import { Document, Schema } from 'mongoose';
import { IClientModel } from '../../../models/src/index';

const mongoose = require('mongoose');

export interface IOAuthClientModel extends IClientModel, Document {
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
