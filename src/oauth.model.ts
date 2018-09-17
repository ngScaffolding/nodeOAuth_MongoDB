import { ExtensionModel, BaseModel, Client, User, Callback, Token, PasswordModel } from 'oauth2-server';
import { Request } from 'express';
import { DB } from './models/database.mongodb';
var JWT = require('jsonwebtoken');

export class OAuthModel implements PasswordModel {

    private JWT_ISSUER = 'ngScaffolding';
    private JWT_SECRET_FOR_ACCESS_TOKEN = 'XT6PRpRuehFsyMa2';
    private JWT_SECRET_FOR_REFRESH_TOKEN = 'JWPVzFWkqGxoE2C2';

    public JWT_ACCESS_TOKEN_EXPIRY_SECONDS = 1800;             // 30 minutes
    public JWT_REFRESH_TOKEN_EXPIRY_SECONDS = 1209600;         // 14 days

    // Required for Password Grant
    getClient(clientId: string, clientSecret: string, callback?: Callback<false | "" | 0 | Client>): Promise<Client | any> {
       
        var client: Client = {
            id: 'TestClient',
            grants: ['password']
        };
        callback(false, client);
        return null;
    }

    grantTypeAllowed(clientID, grantType, callback) {

        console.log('grantTypeAllowed called and clientID is: ', clientID, ' and grantType is: ', grantType);
      
        callback(false, true);
      }

    // Required for Password Grant
    getUser(username: string, password: string, callback?: Callback<false | "" | 0 | User>): Promise<false | "" | 0 | User> {
        
        console.log('getUser() called and username is: ', username, ' and password is: ', password, ' and callback is: ', callback);

        callback(false,{
            id: 'dbaines',
            email: 'dbaines1@hotmail.com',
            roles: ['user', 'admin']
        });
        return null;
    }

    // Required for Password Grant
    saveToken(token: Token, client: Client, user: User, callback?: Callback<any>): Promise<any> {
        throw new Error("Method not implemented.");
    }

   /* saves the accessToken along with the userID retrieved the specified user */
     saveAccessToken(accessToken, clientID, expires, user, callback){

    console.log('saveAccessToken() called and accessToken is: ', accessToken,
    ' and clientID is: ',clientID, ' and user is: ', user)
  
      //save the accessToken along with the user.id
      callback(false, null);
  }

    // Required for Password Grant  
    validateScope?(user: User, client: Client, scope: string, callback?: Callback<string | false | 0>): Promise<string | false | 0> {
        throw new Error("Method not implemented.");
    }
    

    getAccessToken(accessToken: string, callback?: Callback<Token>): Promise<Token> {
        throw new Error("Method not implemented.");
    }
    
    verifyScope(token: Token, scope: string, callback?: Callback<boolean>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    // generateToken
    // This generateToken implementation generates a token with JWT.
    // the token output is the Base64 encoded string.
    generateToken = function(type: string, req: any, callback: Callback<string>) {
    var token;
    var secret;
    var user = req.user;
    var exp = new Date();
    var payload = {
      // public claims
      iss: this.JWT_ISSUER,   // issuer
  //    exp: exp,        // the expiry date is set below - expiry depends on type
  //    jti: '',         // unique id for this token - needed if we keep an store of issued tokens?
      // private claims
      userId: user.id,
      roles: user.roles,
      exp: null
    };
    var options = {
      // algorithms: ['HS256']  // HMAC using SHA-256 hash algorithm
    };
  
    if (type === 'accessToken') {
      secret = this.JWT_SECRET_FOR_ACCESS_TOKEN;
      exp.setSeconds(exp.getSeconds() + this.JWT_ACCESS_TOKEN_EXPIRY_SECONDS);
    } else {
      secret = this.JWT_SECRET_FOR_REFRESH_TOKEN;
      exp.setSeconds(exp.getSeconds() + this.JWT_REFRESH_TOKEN_EXPIRY_SECONDS);
    }
    payload.exp = exp.getTime();

    token = JWT.sign(payload, secret, options);
  
    callback(false, token);
  };
}