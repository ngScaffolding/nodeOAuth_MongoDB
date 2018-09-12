import { Document, Schema } from 'mongoose';

const mongoose = require('mongoose');

const OAuthClientsSchema =  new Schema({
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUris: { type: Array }
  });

  export let OAuthClientsModel = mongoose.model('OAuthClientsModel', OAuthClientsSchema);