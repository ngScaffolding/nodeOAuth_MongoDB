import { IDataAccessLayer } from '../dataAccessLayer';
import { DB } from './database.mongodb';
import { IClientModel } from '../../models/IClient.model';
import { IUserModel } from '../../models/IUser.model';


export class MongoDBDataAccess implements IDataAccessLayer {
  getUsers(adminRoles: string[]): Promise<IUserModel[]> {
    throw new Error("Method not implemented.");
  }
  addUser(user: IUserModel) {
    throw new Error("Method not implemented.");
  }
  updateUser(user: IUserModel) {
    throw new Error("Method not implemented.");
  }
  
  getClientFromID(clientId: string, clientSecret?: string): Promise<IClientModel> {
    return DB.getClientFromID(clientId, clientSecret);
  }  
  
  getUserFromID(userId: string, password?: string): Promise<IUserModel> {
    return DB.getUserFromID(userId, password);
  }
  
  userLoggedOn(userId: string) {
    DB.userLoggedOn(userId);
  }
  
  userLogonFailed(userId: string) {
    DB.userLogonFailed(userId);
  }

}
