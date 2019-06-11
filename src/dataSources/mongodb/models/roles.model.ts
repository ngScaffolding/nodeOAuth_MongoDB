import { Document, Schema } from 'mongoose';
import { Role } from '@ngscaffolding/models';

const mongoose = require('mongoose');

export interface IOAuthRolesModel extends Role, Document {}

const OAuthRoleSchema = new Schema({
  name: { type: String },
  description: { type: String },
  adminRole: { type: String },
  
});

export let OAuthRoleModel = mongoose.model('OAuthRole', OAuthRoleSchema);
