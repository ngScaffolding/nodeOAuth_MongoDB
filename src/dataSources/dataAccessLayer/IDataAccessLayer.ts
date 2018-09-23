import { IClientDataAccess } from "./IClientDataAccess";
import { IUserDataAccess } from './IUserDataAccess';

export interface IDataAccessLayer extends IClientDataAccess, IUserDataAccess {

}