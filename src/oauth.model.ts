import { ExtensionModel, BaseModel, Client, User, Callback, Token, PasswordModel } from 'oauth2-server';

export class TestModel implements PasswordModel {
    generateRefreshToken?(client: Client, user: User, scope: string, callback?: Callback<string>): Promise<string> {
        throw new Error("Method not implemented.");
    }
    
    getUser(username: string, password: string, callback?: Callback<false | "" | 0 | User>): Promise<false | "" | 0 | User> {
        throw new Error("Method not implemented.");
    }
    
    validateScope?(user: User, client: Client, scope: string, callback?: Callback<string | false | 0>): Promise<string | false | 0> {
        throw new Error("Method not implemented.");
    }
    
    getAccessToken(accessToken: string, callback?: Callback<Token>): Promise<Token> {
        throw new Error("Method not implemented.");
    }
    
    verifyScope(token: Token, scope: string, callback?: Callback<boolean>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    generateAccessToken?(client: Client, user: User, scope: string, callback?: Callback<any>): Promise<any> {
        throw new Error("Method not implemented.");
    }    
    
    getClient(clientId: string, clientSecret: string, callback?: Callback<false | "" | 0 | Client>): Promise<any> {
        throw new Error("Method not implemented.");
    }
    saveToken(token: Token, client: Client, user: User, callback?: Callback<any>): Promise<any> {
        throw new Error("Method not implemented.");
    }

}