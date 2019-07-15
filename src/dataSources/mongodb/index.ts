import { IDataAccessLayer } from '../dataAccessLayer';
import { DB } from './database.mongodb';
import { IClientModel, IUserModel, Role } from '../../models/src/index';

export class MongoDBDataAccess implements IDataAccessLayer {
  getRole(name: string): Promise<Role> {
    return DB.getRole(name);
  }
  getAllRoles(): Promise<Role[]> {
    return DB.getAllRoles();
  }
  getUsers(): Promise<IUserModel[]> {
    return DB.getUsers();
  }
  addUser(user: IUserModel) {
    return DB.updateUser(user);
  }
  updateUser(user: IUserModel) {
    return DB.updateUser(user);
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
