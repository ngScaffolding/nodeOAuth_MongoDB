import { Document, Schema } from 'mongoose';
import { Client } from 'oauth2-server';

const mongoose = require('mongoose');

export interface IOAuthClientsModel extends Document {
      id: string;
        redirectUris?: string[];
        grants: string[];
        accessTokenLifetime?: number;
        refreshTokenLifetime?: number;
        [key: string]: any;
}

const OAuthClientsSchema =  new Schema({
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUris: [String]
  });

  export let OAuthClientsModel = mongoose.model('OAuthClientsModel', OAuthClientsSchema);