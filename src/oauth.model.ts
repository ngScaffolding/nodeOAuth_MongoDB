import { ExtensionModel, BaseModel, Client, User, Callback, Token, PasswordModel } from 'oauth2-server';
import { DB } from './models/database.mongodb';

export class OAuthModel implements PasswordModel {

    // Optional for Password Grant
    // generateAccessToken?(client: Client, user: User, scope: string, callback?: Callback<any>): Promise<any> {
    //     throw new Error("Method not implemented.");
    // }    

    // Optional for Password Grant
    // generateRefreshToken?(client: Client, user: User, scope: string, callback?: Callback<string>): Promise<string> {
    //     throw new Error("Method not implemented.");
    // }

    // Required for Password Grant
    getClient(clientId: string, clientSecret: string, callback?: Callback<false | "" | 0 | Client>): Promise<Client | any> {
       
        return null;
    }

    // Required for Password Grant
    getUser(username: string, password: string, callback?: Callback<false | "" | 0 | User>): Promise<false | "" | 0 | User> {
        throw new Error("Method not implemented.");
    }

    // Required for Password Grant
    saveToken(token: Token, client: Client, user: User, callback?: Callback<any>): Promise<any> {
        throw new Error("Method not implemented.");
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
}