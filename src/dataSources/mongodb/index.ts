import { IDataAccessLayer } from '../dataAccessLayer';
import { DB } from './database.mongodb';
import { IClientModel, IUserModel } from 'ngscaffolding-models';
import { Role } from 'ngscaffolding-models';


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
