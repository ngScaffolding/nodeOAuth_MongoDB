import { Document, Schema } from 'mongoose';
import { ErrorModel } from '@ngscaffolding/models';

const mongoose = require('mongoose');

const OAuthTokensSchema = new Schema({
    accessToken: { type: String },
    accessTokenExpiresOn: { type: Date },
    client : { type: Object },  // `client` and `user` are required in multiple places, for example `getAccessToken()`
    clientId: { type: String },
    refreshToken: { type: String },
    refreshTokenExpiresOn: { type: Date },
    user : { type: Object },
    userId: { type: String },
  });

  export let OAuthTokensModel = mongoose.model('OAuthTokensModel', OAuthTokensSchema);