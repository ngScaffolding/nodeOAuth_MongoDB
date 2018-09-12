import { Document, Schema } from 'mongoose'
import { ErrorModel } from '@ngscaffolding/models';

const mongoose = require('mongoose');


  
  mongoose.model('OAuthUsers', new Schema({
    email: { type: String, default: '' },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    username: { type: String }
  }));

export OAuthTokenssModel = mongoose.model('OAuthTokens');
export OAuthClientsModel = mongoose.model('OAuthClients');
export OAuthUsersModel = mongoose.model('OAuthUsers');
