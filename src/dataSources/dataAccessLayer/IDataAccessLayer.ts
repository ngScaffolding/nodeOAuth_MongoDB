import { IClientDataAccess } from "./IClientDataAccess";
import { IUserDataAccess } from './IUserDataAccess';
import { IRoleDataAccess } from './IRoleDataAccess';

export interface IDataAccessLayer extends IClientDataAccess, IUserDataAccess, IRoleDataAccess {

}