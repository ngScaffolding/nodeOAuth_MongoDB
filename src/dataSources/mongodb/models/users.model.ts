import { Document, Schema } from 'mongoose';
import { BasicUser, IUserModel } from '../../../models/src/index';

const mongoose = require('mongoose');

export interface IOAuthUsersModel extends BasicUser, IUserModel, Document {}

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
  changeNextLogon: Boolean,
  confirmHash: String,
  confirmExpires: Date,
  emailConfirmed: Boolean,
  isLocked: Boolean
});

export let OAuthUserModel = mongoose.model('OAuthUser', OAuthUserSchema);
