import { ExtensionModel, BaseModel, Client, User, Callback, Token, PasswordModel } from 'oauth2-server';
import { Request } from 'express';
import { PasswordHelper } from './password.helper';
import { IDataAccessLayer } from './dataSources/dataAccessLayer';
import { SignOptions } from 'jsonwebtoken';
const JWT = require('jsonwebtoken');
const DataSourceSwitch = require('./dataSourceSwitch');

require('dotenv').config();
const winston = require('./config/winston');

export class OAuthModel {

  // Required for Password Grant
  getClient(clientId: string, clientSecret: string, callback?: Callback<false | '' | 0 | Client>): Promise<Client | any> {
    var dataAccess = DataSourceSwitch.default.dataSource as IDataAccessLayer;
    return dataAccess
      .getClientFromID(clientId)
      .then(client => {
        if (client) {
          callback(false, client as Client);
        } else {
          winston.error('Invalid ClientID ', clientId);
          callback(true);
        }
      })
      .catch(err => {
        callback(err);
      });
  }

  grantTypeAllowed(clientID, grantType, callback) {
    winston.info('grantTypeAllowed called and clientID is: ', clientID, ' and grantType is: ', grantType);

    callback(false, true);
  }

  // Required for Password Grant
  getUser(username: string, password: string, callback?: Callback<false | '' | 0 | User>): Promise<false | '' | 0 | User> {
    winston.info('getUser() called and username is: ', username);

    var dataAccess = DataSourceSwitch.default.dataSource as IDataAccessLayer;
    dataAccess
      .getUserFromID(username)
      .then(user => {
        if (!user) {
          callback(true);
          return null;
        }

        // Check for Locked users
        if(user.isLocked) {
          dataAccess.userLogonFailed(username);
          callback('User Locked');
          return null;
        }

        // Compare entered password to salted saved
        let encPassword = PasswordHelper.encodePassword(password, user.salt);

        if (encPassword !== user.password) {
          dataAccess.userLogonFailed(username);
          callback('User name and Password not recognised');
          return null;
        } else {
          dataAccess.userLoggedOn(username);
          callback(false, user as User);
        }
      })
      .catch(err => {
        callback(err);
      });

    return null;
  }

  static getUserById(userId: string): Promise<User> {
    var dataAccess = DataSourceSwitch.default.dataSource as IDataAccessLayer;

    return dataAccess.getUserFromID(userId);
  }

  // Required for Password Grant
  saveToken(token: Token, client: Client, user: User, callback?: Callback<any>): Promise<any> {
    callback(false, null);
    return null;
  }

  // As we're using JWT there's no need to store the token after it's generated
  saveAccessToken(accessToken, clientID, expires, user, callback) {
    callback(false, null);
  }

  // As we're using JWT there's no need to store the token after it's generated
  saveRefreshToken(refreshToken, clientID, expires, userId, callback) {
    callback(false, null);
  }

  // Required for Password Grant
  validateScope?(user: User, client: Client, scope: string, callback?: Callback<string | false | 0>): Promise<string | false | 0> {
    throw new Error('Method not implemented.');
  }

  // The bearer token is a JWT, so we decrypt and verify it. We get a reference to the
  // user in this function which oauth2-server puts into the req object
  getRefreshToken = function(bearerToken, callback) {
    return JWT.verify(bearerToken, process.env.JWT_SECRET_FOR_REFRESH_TOKEN, function(err, decoded) {
      if (err) {
        return callback(err, false);
      }

      // other verifications could be performed here
      // eg. that the jti is valid

      // instead of passing the payload straight out we use an object with the
      // mandatory keys expected by oauth2-server plus any other private
      // claims that are useful
      return callback(false, {
        expires: new Date(decoded.exp),
        user: OAuthModel.getUserById(decoded.userId)
      });
    });
  };

  getAccessToken(accessToken: string, callback?: Callback<Token | any>) {
    JWT.verify(accessToken, process.env.JWT_SECRET_FOR_ACCESS_TOKEN, function(err, decoded) {
      if (err) {
        return callback(err, false); // the err contains JWT error data
      }

      // other verifications could be performed here
      // eg. that the jti is valid

      // we could pass the payload straight out we use an object with the
      // mandatory keys expected by oauth2-server, plus any other private
      // claims that are useful

      OAuthModel.getUserById(decoded.userId).then(user => {
        callback(false, {
          expires: new Date(decoded.exp),
          user: user
        });
      });
    });
  }

  verifyScope(token: Token, scope: string, callback?: Callback<boolean>): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  // generateToken
  // This generateToken implementation generates a token with JWT.
  // the token output is the Base64 encoded string.
  generateToken = function(type: string, req: any, callback: Callback<string>) {
    var user = req.user;

    var payload = {
      role: user.role,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email
    };

    var options: SignOptions = {
      issuer: process.env.JWT_ISSUER,
      subject: user.userId,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
      algorithm: 'HS256'
    };

    let token = null;
    try {
      token = JWT.sign(payload, process.env.JWT_PRIVATE_KEY, options);
    } catch (err) {
      winston.error(err);
      callback(true, token);
    }
    callback(false, token);
  };
}
