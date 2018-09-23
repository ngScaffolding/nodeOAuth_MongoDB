import { IDataAccessLayer } from '../dataAccessLayer';
import { DB } from './database.mongodb';
import { IOAuthClientModel } from './models/clients.model';
import { IOAuthUsersModel } from './models/users.model';


export class MongoDBDataAccess implements IDataAccessLayer {
  
  getClientFromID(clientId: string, clientSecret?: string): Promise<IOAuthClientModel> {
    return DB.getClientFromID(clientId, clientSecret);
  }  
  
  getUserFromID(userId: string, password?: string): Promise<IOAuthUsersModel> {
    return DB.getUserFromID(userId, password);
  }
  
  userLoggedOn(userId: string) {
    DB.userLoggedOn(userId);
  }
  
  userLogonFailed(userId: string) {
    DB.userLogonFailed(userId);
  }

}
